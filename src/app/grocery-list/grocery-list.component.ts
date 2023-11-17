import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, RouterOutlet } from '@angular/router';

import { GroceryListService } from './grocery-list.service';
import { HttpClientModule } from '@angular/common/http';
import { StoreService } from '../stores/store.service';
import { IngredientService } from './grocery-list-details/ingredient.service';

@Component({
  selector: 'app-grocery-list',
  standalone: true,
  imports: [CommonModule, RouterOutlet, HttpClientModule],
  providers: [GroceryListService, StoreService, IngredientService],
  templateUrl: './grocery-list.component.html',
  styleUrl: './grocery-list.component.scss'
})
export class GroceryListComponent {
}
