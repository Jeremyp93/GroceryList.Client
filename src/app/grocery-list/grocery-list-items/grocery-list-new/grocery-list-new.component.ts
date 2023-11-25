import { Component, ElementRef, OnDestroy, OnInit, QueryList, ViewChildren, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Observable, lastValueFrom } from 'rxjs';
import { FormArray, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { v4 as UUID } from 'uuid';
import { Store as NgxsStore } from '@ngxs/store';

import { HeaderComponent } from '../../../shared/header/header.component';
import { StoreService } from '../../../store/store.service';
import { ButtonComponent } from '../../../shared/button/button.component';
import { GroceryListService } from '../../grocery-list.service';
import { Ingredient } from '../../types/ingredient.type';
import { Store } from '../../../store/types/store.type';
import { AddGroceryList, UpdateGroceryList } from '../../ngxs-store/grocery-list.actions';
import { ButtonStyle } from '../../../shared/button/button-style.enum';
import { ROUTES_PARAM, GROCERY_LIST_FORM, INGREDIENT_FORM } from '../../../constants';

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
  ngStore = inject(NgxsStore);
  stores$!: Observable<Store[]>;
  groceryListForm!: FormGroup;
  categories: string[] = [];
  editMode: boolean = false;
  idToEdit: string | null = null;
  submitted: boolean = false;

  @ViewChildren('inputFields') inputFields!: QueryList<ElementRef>;

  get ingredientControls() { // a getter!
    return (this.groceryListForm.get(GROCERY_LIST_FORM.INGREDIENTS) as FormArray).controls;
  }

  get buttonStyles(): typeof ButtonStyle {
    return ButtonStyle;
  }

  ngOnInit(): void {
    this.route.params.subscribe(async (params: Params) => {
      this.idToEdit = params[ROUTES_PARAM.ID_PARAMETER];
      if (this.idToEdit) {
        this.editMode = true;
      }
      await this.#initForm();
      this.stores$ = this.storeService.getAllStores();
    });
  }

  onAddIngredient = () => {
    const ingredients = this.groceryListForm.get(GROCERY_LIST_FORM.INGREDIENTS) as FormArray;
    ingredients.insert(0, new FormGroup({
      [INGREDIENT_FORM.ID]: new FormControl(UUID()),
      [INGREDIENT_FORM.NAME]: new FormControl(null, Validators.required),
      [INGREDIENT_FORM.AMOUNT]: new FormControl("1", [Validators.required, Validators.pattern(/^[1-9]+[0-9]*$/)]),
      [INGREDIENT_FORM.CATEGORY]: new FormControl("")
    }));
    setTimeout(() => {
      this.#focusOnControl(0);
    }, 50);
  }

  onDeleteIngredient = (id: string) => {
    const ingredients = this.groceryListForm.get(GROCERY_LIST_FORM.INGREDIENTS) as FormArray;
    const index = ingredients.controls.findIndex(c => c.get(INGREDIENT_FORM.ID)?.value === id);
    ingredients.removeAt(index);
  }

  onSubmit = () => {
    this.submitted = true;
    if (this.groceryListForm.invalid) return;
    if (this.editMode) {
      if (!this.groceryListForm.pristine) {
        this.ngStore.dispatch(new UpdateGroceryList(this.groceryListForm.value, this.idToEdit!)).subscribe(_ => this.#back());
      } else {
        this.#back();
      }
    } else {
      this.ngStore.dispatch(new AddGroceryList(this.groceryListForm.value)).subscribe(_ => this.#back());
    }
  }

  onChangeStore = async (event: Event) => {
    const selectedValue = (event.target as HTMLSelectElement).value;
    if (!selectedValue) {
      this.categories = [];
      return;
    }
    const store = await lastValueFrom(this.storeService.getStoreById(selectedValue));
    this.categories = store.sections.map(s => s.name);
  }

  onEnterPressed = (event: KeyboardEvent | Event) => {
    event.preventDefault();
    this.onAddIngredient();
  }

  #initForm = async () => {
    let name: string = '';
    let storeId: string = '';
    let ingredients: FormArray<any> = new FormArray<any>([]);

    if (this.editMode) {
      const groceryList = await lastValueFrom(this.groceryListService.getGroceryList(this.idToEdit!));
      name = groceryList.name;
      if (groceryList.store) {
        storeId = groceryList.store.id;
        this.categories = groceryList.store.sections.map(s => s.name);
      }
      if (groceryList.ingredients.length > 0) {
        groceryList.ingredients.forEach((ingredient: Ingredient) => {
          ingredients.push(new FormGroup({
            id: new FormControl(ingredient.id),
            name: new FormControl(ingredient.name, Validators.required),
            amount: new FormControl(ingredient.amount, [Validators.required, Validators.pattern(/^[1-9]+[0-9]*$/)]),
            category: new FormControl(ingredient.category)
          }));
        });
      }
    }

    this.groceryListForm = new FormGroup({
      name: new FormControl(name, Validators.required),
      storeId: new FormControl(storeId),
      ingredients: ingredients,
    });
  }

  #focusOnControl = (index: number) => {
    const elements = this.inputFields.toArray();
    if (elements[index]) {
      elements[index].nativeElement.focus();
    }
  }

  #back = () => {
    this.router.navigate(['../'], { relativeTo: this.route });
  }
}
