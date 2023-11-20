import { Component, OnDestroy, OnInit, Renderer2, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { Subscription } from 'rxjs';
import { style, transition, trigger, animate } from '@angular/animations';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

import { GroceryList, GroceryListService } from '../grocery-list.service';
import { AnchorButtonComponent } from '../../shared/anchor-button/anchor-button.component';
import { ButtonComponent } from '../../shared/button/button.component';
import { HeaderComponent } from '../../shared/header/header.component';
import { ModalComponent } from '../../shared/modal/modal.component';

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
export class GroceryListItemsComponent implements OnInit, OnDestroy {
  groceryListService = inject(GroceryListService);
  router = inject(Router);
  route = inject(ActivatedRoute);
  groceryLists: GroceryList[] = [];
  modalOpen: boolean = false;
  duplicateForm!: FormGroup;
  duplicateFormSubmitted = false;
  isLoading: boolean = false;
  private selectedList: GroceryList | null = null;
  private sub!: Subscription;

  ngOnInit(): void {
    this.groceryListService.getAllGroceryLists();
    this.sub = this.groceryListService.groceryListUpdated$.subscribe(lists => this.groceryLists = this.sortByDate(lists));
    this.initForm();
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

  selectList = (id: string) => {
    this.router.navigate(['grocery-lists', id]);
  }

  newList = () => {
    this.router.navigate(['grocery-lists', 'new']);
  }

  editList = (event: Event, id: string) => {
    this.preventPropagation(event);
    this.router.navigate(['grocery-lists', id, 'edit']);
  }

  showDeleteList = (event: Event, id: string) => {
    this.preventPropagation(event);
    const groceryList = this.groceryLists.find(g => g.id === id);
    groceryList!.showDelete = true;
  }

  deleteList = (event: Event, id: string) => {
    this.preventPropagation(event);
    this.groceryListService.deleteGroceryList(id);
  }

  cancelDeleteList = (event: Event, id: string) => {
    this.preventPropagation(event);
    const groceryList = this.groceryLists.find(g => g.id === id);
    groceryList!.showDelete = false;
  }

  openModal = (event: Event, list: GroceryList): void => {
    this.preventPropagation(event);
    this.selectedList = list;
    this.modalOpen = true;
  }

  preventPropagation(event: Event): void {
    event.stopPropagation();
  }

  onSubmitDuplicateForm = async () => {
    this.duplicateFormSubmitted = true;
    if (this.duplicateForm.invalid) return;
    if (!this.selectedList) return;
    this.isLoading = true;
    const name = this.duplicateForm.get('name')?.value;
    const list = { ...this.selectedList, name: name };
    await this.groceryListService.addGroceryList(list);
    this.duplicateForm.reset();
    this.selectedList = null;
    this.duplicateFormSubmitted = this.isLoading = this.modalOpen = false;
  }

  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }

  private sortByDate = (list: GroceryList[]): GroceryList[] => {
    return list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  private initForm = () => {
    this.duplicateForm = new FormGroup({
      name: new FormControl('', Validators.required),
    });
  }
}
