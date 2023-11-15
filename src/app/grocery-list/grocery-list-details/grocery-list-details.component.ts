import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Params, Router, RouterModule } from '@angular/router';
import { GroceryList, GroceryListService, Ingredient } from '../grocery-list.service';
import { Subscription, lastValueFrom } from 'rxjs';
import { TileIngredientComponent } from './tile-ingredient/tile-ingredient.component';
import { IngredientService } from './ingredient.service';

@Component({
  selector: 'app-grocery-list-details',
  standalone: true,
  imports: [CommonModule, RouterModule, TileIngredientComponent],
  templateUrl: './grocery-list-details.component.html',
  styleUrl: './grocery-list-details.component.scss'
})
export class GroceryListDetailsComponent implements OnInit, OnDestroy {
  route = inject(ActivatedRoute);
  router = inject(Router);
  groceryListService = inject(GroceryListService);
  ingredientService = inject(IngredientService);
  ingredientSubscription!: Subscription;
  id = '';
  ingredients: Ingredient[] = [];
  error: boolean = false;

  ngOnInit(): void {
    this.route.params.subscribe(async (params: Params) => {
      this.id = params['id'];
      const groceryList = await lastValueFrom(await this.groceryListService.getGroceryList(this.id));
      this.ingredientService.setAndSortIngredientsByPriority(groceryList.ingredients, groceryList.store?.sections);
    });
    this.ingredientSubscription = this.ingredientService.ingredients$.subscribe(ingredients => this.ingredients = ingredients);
  }

  back = () => {
    this.router.navigate(['../'], { relativeTo: this.route });
  }

  putInBasket = (index: number) => {
    this.ingredientService.putInBasket(index);
  }

  ngOnDestroy(): void {
    this.ingredientSubscription.unsubscribe();
  }
}
