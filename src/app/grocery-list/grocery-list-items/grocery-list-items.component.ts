import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { Observable } from 'rxjs';
import { style, transition, trigger, animate } from '@angular/animations';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

import { AnchorButtonComponent } from '../../shared/anchor-button/anchor-button.component';
import { ButtonComponent } from '../../shared/button/button.component';
import { HeaderComponent } from '../../shared/header/header.component';
import { ModalComponent } from '../../shared/modal/modal.component';
import { GroceryList } from '../types/grocery-list.type';
import { Select, Store } from '@ngxs/store';
import { GroceryListState } from '../ngxs-store/grocery-list.state';
import { AddGroceryList, DeleteGroceryList, GetGroceryLists, SetSelectedGroceryList } from '../ngxs-store/grocery-list.actions';
import { ButtonStyle } from '../../shared/button/button-style.enum';

@Component({
  selector: 'app-grocery-list-items',
  standalone: true,
  imports: [CommonModule, AnchorButtonComponent, RouterModule, ButtonComponent, HeaderComponent, ModalComponent, ReactiveFormsModule],
  templateUrl: './grocery-list-items.component.html',
  styleUrl: './grocery-list-items.component.scss',
  animations: [
    trigger('deleteFadeSlideInOut', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateX(20%)' }),
        animate('300ms', style({ opacity: 1, transform: 'translateX(0)' })),
      ]),
      transition(':leave', [
        animate('300ms', style({ opacity: 0, transform: 'translateX(20%)' })),
      ]),
    ]),
    trigger('tileFadeSlideOut', [
      transition(':leave', [
        animate('300ms', style({ transform: 'translateX(100%)' })),
      ]),
    ])
  ],
})
export class GroceryListItemsComponent implements OnInit {
  router = inject(Router);
  route = inject(ActivatedRoute);
  ngStore = inject(Store);
  @Select(GroceryListState.getGroceryLists) groceryLists$!: Observable<GroceryList[]>;
  @Select(GroceryListState.getSelectedGroceryList) selectedGroceryList$!: Observable<GroceryList | null>;
  modalOpen: boolean = false;
  duplicateForm!: FormGroup;
  duplicateFormSubmitted = false;
  isLoading: boolean = false;
  #selectedList: GroceryList | null = null;

  get buttonStyles(): typeof ButtonStyle {
    return ButtonStyle;
  }

  ngOnInit(): void {
    this.ngStore.dispatch(new GetGroceryLists());
    this.#initForm();
  }

  getLinkMapsStore = (list: GroceryList): string | undefined => {
    if (!list.store) return;

    if (/Mobi|Android/i.test(navigator.userAgent)) {
      // Open the map with the specified address
      return `geo:0,0?q=${list.store.street}, ${list.store.city} ${list.store.zipCode}, ${list.store.country}`;
    } else {
      return `https://www.google.com/maps?q=${list.store.street}, ${list.store.city} ${list.store.zipCode}, ${list.store.country}`;
    }
  }

  displayCreatedAt = (createdAt: Date): string => {
    const date = new Date(createdAt);

    if (isNaN(date.getTime())) {
      return "Invalid Date";
    }

    return date.toLocaleDateString();
  }

  selectList = (list: GroceryList) => {
    this.ngStore.dispatch(new SetSelectedGroceryList(list)).subscribe(_ => this.router.navigate(['grocery-lists', list.id]));
  }

  newList = () => {
    this.router.navigate(['grocery-lists', 'new']);
  }

  editList = (event: Event, id: string) => {
    this.preventPropagation(event);
    this.router.navigate(['grocery-lists', id, 'edit']);
  }

  showDeleteList = (event: Event, list: GroceryList) => {
    this.preventPropagation(event);
    list.showDelete = true;
  }

  deleteList = (event: Event, id: string) => {
    this.preventPropagation(event);
    this.ngStore.dispatch(new DeleteGroceryList(id));
  }

  cancelDeleteList = (event: Event, list: GroceryList) => {
    this.preventPropagation(event);
    list.showDelete = false;
  }

  openModal = (event: Event, list: GroceryList): void => {
    this.preventPropagation(event);
    this.#selectedList = list;
    this.modalOpen = true;
  }

  preventPropagation(event: Event): void {
    event.stopPropagation();
  }

  onSubmitDuplicateForm = async () => {
    this.duplicateFormSubmitted = true;
    if (this.duplicateForm.invalid) return;
    if (!this.#selectedList) return;
    this.isLoading = true;
    const name = this.duplicateForm.get('name')?.value;
    const list = { ...this.#selectedList, name: name };
    this.ngStore.dispatch(new AddGroceryList(list)).subscribe(_ => {
      this.duplicateForm.reset();
      this.ngStore.dispatch(new SetSelectedGroceryList(null));
      this.duplicateFormSubmitted = this.isLoading = this.modalOpen = false;
    });
  }

  #initForm = () => {
    this.duplicateForm = new FormGroup({
      name: new FormControl('', Validators.required),
    });
  }
}
