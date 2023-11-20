import { AfterViewInit, Component, ComponentFactoryResolver, ComponentRef, OnDestroy, OnInit, ViewChild, ViewContainerRef, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Params, Router, RouterModule } from '@angular/router';
import { Subscription, lastValueFrom } from 'rxjs';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

import { GroceryListService, Ingredient } from '../grocery-list.service';
import { TileIngredientComponent } from './tile-ingredient/tile-ingredient.component';
import { IngredientService } from './ingredient.service';
import { HeaderComponent } from '../../shared/header/header.component';
import { ButtonComponent } from '../../shared/button/button.component';
import { animate, style, transition, trigger } from '@angular/animations';
import { LoadingComponent } from '../../shared/loading/loading.component';
import { TileAddIngredientComponent } from './tile-add-ingredient/tile-add-ingredient.component';
import { ModalComponent } from '../../shared/modal/modal.component';
import { StoreService } from '../../store/store.service';

@Component({
  selector: 'app-grocery-list-details',
  standalone: true,
  imports: [CommonModule, RouterModule, TileIngredientComponent, HeaderComponent, ButtonComponent, LoadingComponent, ReactiveFormsModule, ModalComponent],
  templateUrl: './grocery-list-details.component.html',
  styleUrl: './grocery-list-details.component.scss',
  animations: [
    trigger('tileFadeSlideOut', [
      transition(':leave', [
        animate('300ms', style({ transform: 'translateX(100%)' })),
      ]),
    ])
  ],
})
export class GroceryListDetailsComponent implements OnInit, OnDestroy {
  @ViewChild('dynamicComponentContainer', { read: ViewContainerRef }) dynamicComponentContainer!: ViewContainerRef;
  route = inject(ActivatedRoute);
  router = inject(Router);
  storeService = inject(StoreService);
  groceryListService = inject(GroceryListService);
  ingredientService = inject(IngredientService);
  ingredientSubscription!: Subscription;
  id = '';
  ingredients: Ingredient[] = [];
  error: boolean = false;
  title: string = 'Ingredients to buy';
  saved: boolean = false;
  isLoading: boolean = false;
  itemAddedSubscription: Subscription | null = null;
  addFormClosedSubscription: Subscription | null = null;
  modalOpen: boolean = false;
  exportForm!: FormGroup;
  exportFormSubmitted: boolean = false;
  storeId: string | null = null;

  ngOnInit(): void {
    this.ingredientSubscription = this.ingredientService.ingredients$.subscribe(ingredients => this.ingredients = ingredients);
    this.route.params.subscribe(async (params: Params) => {
      this.id = params['id'];
      const groceryList = await lastValueFrom(await this.groceryListService.getGroceryList(this.id));
      this.storeId = groceryList.storeId;
      this.title = groceryList.name;
      this.ingredientService.setSections(groceryList.store?.sections ?? []);
      this.ingredientService.setAndSortIngredientsByPriority(groceryList.ingredients);
      this.initForm();
    });
  }

  back = () => {
    this.router.navigate(['../'], { relativeTo: this.route });
  }

  putInBasket = (index: number) => {
    this.ingredientService.putInBasket(index);
  }

  resetIngredients = () => {
    this.ingredientService.resetIngredients();
  }

  newIngredient = () => {
    const componentRef = this.dynamicComponentContainer.createComponent(TileAddIngredientComponent);
    componentRef.setInput('sections', this.ingredientService.getSections());
    this.itemAddedSubscription = componentRef.instance.itemAdded.subscribe(ingredient => {
      this.ingredientService.addIngredient(ingredient);
      this.itemAddedSubscription?.unsubscribe();
      this.dynamicComponentContainer.clear();
    });
    setTimeout(() => {
      this.addFormClosedSubscription = componentRef.instance.onClickOutside.subscribe(_ => {
        this.addFormClosedSubscription?.unsubscribe();
        this.dynamicComponentContainer.clear();
      });
    });
  }

  deleteIngredient = (id: string) => {
    this.ingredientService.deleteIngredient(id);
  }

  editIngredient = () => {
    this.router.navigate(['edit'], { relativeTo: this.route });
  }

  saveIngredients = async () => {
    this.isLoading = true;
    await this.ingredientService.saveIngredients(this.id);
    this.isLoading = false;
    this.saved = true;
    setTimeout(() => {
      this.saved = false;
    }, 1000);
  }

  exportToNewList = async (event: Event) => {
    event.stopPropagation();
    await this.storeService.getAllStores();
    this.modalOpen = true;
  }

  onSubmitExportForm = async () => {
    const name = this.exportForm.value.name;
    const storeId = this.exportForm.value.storeId;
    this.exportFormSubmitted = true;
    if (this.exportForm.invalid) return;
    const groceryList = await lastValueFrom(await this.groceryListService.getGroceryList(this.id));
    const newList = { ...groceryList, name: name, storeId: storeId, ingredients: [...this.ingredientService.getIngredients().filter(i => !i.selected)] };
    await this.groceryListService.addGroceryList(newList);
    this.exportForm.reset();
    this.exportFormSubmitted = false;
    this.back();
  }

  getCategories = (): string[] => {
    return this.ingredientService.getSections().map(s => s.name);
  }

  initForm = () => {
    this.exportForm = new FormGroup({
      name: new FormControl('', Validators.required),
      storeId: new FormControl(this.storeId ?? '')
    });
  }

  ngOnDestroy(): void {
    this.ingredientSubscription.unsubscribe();
    this.ingredientService.setIngredients([]);
    if (this.itemAddedSubscription) {
      this.itemAddedSubscription.unsubscribe();
    }
    if (this.addFormClosedSubscription) {
      this.addFormClosedSubscription.unsubscribe();
    }
  }
}
