import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { Subscription } from 'rxjs';

import { GroceryList, GroceryListService } from '../grocery-list.service';
import { AnchorButtonComponent } from '../../shared/anchor-button/anchor-button.component';

@Component({
  selector: 'app-grocery-list-items',
  standalone: true,
  imports: [CommonModule, AnchorButtonComponent, RouterModule],
  templateUrl: './grocery-list-items.component.html',
  styleUrl: './grocery-list-items.component.scss'
})
export class GroceryListItemsComponent implements OnInit, OnDestroy {
  groceryListService = inject(GroceryListService);
  router = inject(Router);
  route = inject(ActivatedRoute);
  groceryLists: GroceryList[] = [];
  private sub!: Subscription;

  ngOnInit(): void {
    this.groceryListService.getAllGroceryLists();
    this.sub = this.groceryListService.groceryListUpdated$.subscribe(lists => this.groceryLists = lists);
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
    this.router.navigate(['grocery-list', id]);
  }

  preventPropagation(event: Event): void {
    event.stopPropagation();
  }

  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }
}
