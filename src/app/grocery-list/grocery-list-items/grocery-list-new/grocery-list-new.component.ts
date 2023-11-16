import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from '../../../shared/header/header.component';
import { Section, Store, StoreService } from '../../../stores/store.service';
import { Observable, Subscription, lastValueFrom } from 'rxjs';
import { ButtonComponent } from '../../../shared/button/button.component';
import { FormArray, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { GroceryListService } from '../../grocery-list.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-grocery-list-new',
  standalone: true,
  imports: [CommonModule, HeaderComponent, ButtonComponent, ReactiveFormsModule],
  templateUrl: './grocery-list-new.component.html',
  styleUrl: './grocery-list-new.component.scss'
})
export class GroceryListNewComponent implements OnInit {
  storeService = inject(StoreService);
  groceryListService = inject(GroceryListService);
  router = inject(Router);
  route = inject(ActivatedRoute);
  groceryListForm!: FormGroup;
  categories: string[] = [];

  get ingredientControls() { // a getter!
    return (this.groceryListForm.get('ingredients') as FormArray).controls;
  }

  ngOnInit(): void {
    this.storeService.getAllStores();
    this.initForm();
  }

  onAddIngredient = () => {
    const ingredients = this.groceryListForm.get('ingredients') as FormArray;
    ingredients.insert(0, new FormGroup({
      'id': new FormControl(this.generateGUID()),
      'name': new FormControl(null, Validators.required),
      'amount': new FormControl("1", [Validators.required, Validators.pattern(/^[1-9]+[0-9]*$/)]),
      'category': new FormControl("")
    }));
  }

  onDeleteIngredient = (id: string) => {
    const ingredients = this.groceryListForm.get('ingredients') as FormArray;
    const index = ingredients.controls.findIndex(c => c.get('id')?.value === id);
    ingredients.removeAt(index);
  }

  onSubmit = () => {
    if (this.groceryListForm.invalid) {
      return;
    }
    this.groceryListService.addGroceryList(this.groceryListForm.value);
    this.router.navigate(['../'], { relativeTo: this.route });
  }

  onChangeStore = async (event: Event) => {
    const selectedValue = (event.target as HTMLSelectElement).value;
    if (!selectedValue) {
      this.categories = [];
      return;
    }
    const store = await lastValueFrom(await this.storeService.getStoreById(selectedValue));
    this.categories = store.sections.map(s => s.name);
  }

  private initForm = () => {
    let name: string = '';
    let store: string = '';
    let ingredients: FormArray<any> = new FormArray<any>([]);

    /* if (this.editMode) {
      const recipe = this.recipeService.getRecipe(this.indexRecipe);
      name = recipe.name;
      imagePath = recipe.imagePath;
      description = recipe.description;
      if (recipe.ingredients.length > 0) {
        recipe.ingredients.forEach((ingredient: Ingredient) => {
          ingredients.push(new FormGroup({
            name: new FormControl(ingredient.name, Validators.required),
            amount: new FormControl(ingredient.amount, [Validators.required, Validators.pattern(/^[1-9]+[0-9]*$/)])
          }));
        });
      }
    } */

    this.groceryListForm = new FormGroup({
      name: new FormControl(name, Validators.required),
      storeId: new FormControl(store),
      ingredients: ingredients,
    });
  }

  private generateGUID = () => {
    const randomHex = () => Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
    return `${randomHex()}${randomHex()}-${randomHex()}-4${randomHex().substr(0, 3)}-${randomHex()}-${randomHex()}${randomHex()}${randomHex()}`;
  }
}
