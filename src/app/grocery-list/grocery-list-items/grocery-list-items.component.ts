import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { Observable } from 'rxjs';
import { style, transition, trigger, animate } from '@angular/animations';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { LetDirective } from '@ngrx/component';

import { AnchorButtonComponent } from '../../shared/anchor-button/anchor-button.component';
import { ButtonComponent } from '../../shared/button/button.component';
import { HeaderComponent } from '../../shared/header/header.component';
import { ModalComponent } from '../../shared/modal/modal.component';
import { GroceryList } from '../types/grocery-list.type';
import { Select, Store } from '@ngxs/store';
import { GroceryListState } from '../ngxs-store/grocery-list.state';
import { AddGroceryList, DeleteGroceryList, GetGroceryLists, SetSelectedGroceryList } from '../ngxs-store/grocery-list.actions';
import { ButtonStyle } from '../../shared/button/button-style.enum';
import { AlertComponent } from '../../shared/alert/alert.component';
import { GROCERY_LIST_FORM, ROUTES_PARAM, GOOGLE_MAPS_QUERY, GEO_MOBILE_QUERY } from '../../constants';

@Component({
  selector: 'app-grocery-list-items',
  standalone: true,
  imports: [CommonModule, AnchorButtonComponent, RouterModule, ButtonComponent, HeaderComponent, ModalComponent, ReactiveFormsModule, AlertComponent, LetDirective],
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
  modalOpen: boolean = false;
  duplicateForm!: FormGroup;
  duplicateFormSubmitted = false;
  isLoading: boolean = false;
  #selectedList: GroceryList | null = null;
  modalError: boolean = false;
  error: boolean = false;
  errorMessage: string | null = null;

  get buttonStyles(): typeof ButtonStyle {
    return ButtonStyle;
  }

  ngOnInit(): void {
    this.ngStore.dispatch(new GetGroceryLists()).subscribe({ error: (err: Error) => { this.error = true; this.errorMessage = err.message; } });
    this.#initForm();
  }

  getLinkMapsStore = (list: GroceryList): string | undefined => {
    if (!list.store) return;

    if (/Mobi|Android/i.test(navigator.userAgent)) {
      // Open the map with the specified address
      return `${GEO_MOBILE_QUERY}${list.store.street}, ${list.store.city} ${list.store.zipCode}, ${list.store.country}`;
    } else {
      return `${GOOGLE_MAPS_QUERY}${list.store.street}, ${list.store.city} ${list.store.zipCode}, ${list.store.country}`;
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
    this.ngStore.dispatch(new SetSelectedGroceryList(list)).subscribe(_ => this.router.navigate([ROUTES_PARAM.GROCERY_LIST, list.id]));
  }

  newList = () => {
    this.router.navigate([ROUTES_PARAM.GROCERY_LIST, ROUTES_PARAM.NEW]);
  }

  editList = (event: Event, id: string) => {
    this.preventPropagation(event);
    this.router.navigate([ROUTES_PARAM.GROCERY_LIST, id, ROUTES_PARAM.EDIT]);
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
    this.errorMessage = null;
    this.modalError = false;
    this.duplicateFormSubmitted = true;
    if (this.duplicateForm.invalid) return;
    if (!this.#selectedList) return;
    this.isLoading = true;
    const name = this.duplicateForm.get(GROCERY_LIST_FORM.NAME)?.value;
    const list = { ...this.#selectedList, name: name };
    this.ngStore.dispatch(new AddGroceryList(list)).subscribe({
      next: () => {
        this.duplicateForm.reset();
        this.ngStore.dispatch(new SetSelectedGroceryList(null));
        this.duplicateFormSubmitted = this.isLoading = this.modalOpen = false;
      },
      error: (error: Error) => {
        this.duplicateFormSubmitted = this.isLoading = false;
        this.errorMessage = error.message;
        this.modalError = true;
      }
    });
  }

  #initForm = () => {
    this.duplicateForm = new FormGroup({
      [GROCERY_LIST_FORM.NAME]: new FormControl('', Validators.required),
    });
  }
}
