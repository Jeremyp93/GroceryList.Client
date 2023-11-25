import { Component, OnDestroy, OnInit, ViewChild, ViewContainerRef, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Params, Router, RouterModule } from '@angular/router';
import { Observable, Subscription, lastValueFrom, take } from 'rxjs';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Select, Store as NgxsStore } from '@ngxs/store';

import { GroceryListService } from '../grocery-list.service';
import { TileIngredientComponent } from './tile-ingredient/tile-ingredient.component';
import { HeaderComponent } from '../../shared/header/header.component';
import { ButtonComponent } from '../../shared/button/button.component';
import { animate, style, transition, trigger } from '@angular/animations';
import { LoadingComponent } from '../../shared/loading/loading.component';
import { TileAddIngredientComponent } from './tile-add-ingredient/tile-add-ingredient.component';
import { ModalComponent } from '../../shared/modal/modal.component';
import { StoreService } from '../../store/store.service';
import { Ingredient } from '../types/ingredient.type';
import { Store } from '../../store/types/store.type';
import { Section } from '../../store/types/section.type';
import { IngredientState } from '../ngxs-store/ingredient.state';
import { AddIngredient, DeleteIngredient, ResetIngredients, SaveIngredients, SelectIngredient } from '../ngxs-store/ingredient.actions';
import { AddGroceryList, SetSelectedGroceryList } from '../ngxs-store/grocery-list.actions';
import { GroceryListState } from '../ngxs-store/grocery-list.state';
import { GroceryList } from '../types/grocery-list.type';
import { ButtonStyle } from '../../shared/button/button-style.enum';
import { ROUTES_PARAM, GROCERY_LIST_FORM } from '../../constants';

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
  ]
})
export class GroceryListDetailsComponent implements OnInit, OnDestroy {
  @ViewChild('dynamicComponentContainer', { read: ViewContainerRef }) dynamicComponentContainer!: ViewContainerRef;
  route = inject(ActivatedRoute);
  router = inject(Router);
  storeService = inject(StoreService);
  groceryListService = inject(GroceryListService);
  ngStore = inject(NgxsStore);
  @Select(IngredientState.getIngredients) ingredients$!: Observable<Ingredient[]>;
  @Select(IngredientState.getSections) sections$!: Observable<Section[]>;
  @Select(GroceryListState.getSelectedGroceryList) selectedGrocery$!: Observable<GroceryList>;
  stores$!: Observable<Store[]>;
  id = '';
  sections: Section[] = [];
  error: boolean = false;
  title: string = 'Ingredients to buy';
  saved: boolean = false;
  isLoading: boolean = false;
  itemAddedSubscription: Subscription | null = null;
  addFormClosedSubscription: Subscription | null = null;
  modalOpen: boolean = false;
  exportForm!: FormGroup;
  exportFormSubmitted: boolean = false;
  storeId: string | undefined;
  saveProcess: boolean = false;

  get buttonStyles(): typeof ButtonStyle {
    return ButtonStyle;
  }

  ngOnInit(): void {
    this.route.params.subscribe(async (params: Params) => {
      this.id = params[ROUTES_PARAM.ID_PARAMETER];
      const groceryList = await lastValueFrom(this.groceryListService.getGroceryList(this.id));
      this.selectedGrocery$.pipe(take(1)).subscribe(list => {
        if (!list) {
          this.ngStore.dispatch(new SetSelectedGroceryList(groceryList));
        }
      });
      this.storeId = groceryList.store?.id;
      this.title = groceryList.name;
      this.initForm();
    });
  }

  back = () => {
    this.router.navigate(['../'], { relativeTo: this.route });
  }

  putInBasket = (index: number) => {
    this.ngStore.dispatch(new SelectIngredient(index));
  }

  resetIngredients = () => {
    this.ngStore.dispatch(new ResetIngredients());
  }

  newIngredient = () => {
    const componentRef = this.dynamicComponentContainer.createComponent(TileAddIngredientComponent);
    this.sections$.pipe(take(1)).subscribe(sections => {
      componentRef.setInput('sections', sections);
      this.itemAddedSubscription = componentRef.instance.itemAdded.subscribe(ingredient => {
        this.ngStore.dispatch(new AddIngredient(ingredient));
        this.itemAddedSubscription?.unsubscribe();
        this.dynamicComponentContainer.clear();
      });
      setTimeout(() => {
        this.addFormClosedSubscription = componentRef.instance.onClickOutside.subscribe(_ => {
          this.addFormClosedSubscription?.unsubscribe();
          this.dynamicComponentContainer.clear();
        });
      });
    });
  }

  deleteIngredient = (id: string) => {
    this.ngStore.dispatch(new DeleteIngredient(id));
  }

  editGroceryList = () => {
    this.router.navigate(['edit'], { relativeTo: this.route });
  }

  saveIngredients = async () => {
    this.saveProcess = true;
    this.isLoading = true;
    this.ngStore.dispatch(new SaveIngredients(this.id)).subscribe(_ => {
      this.isLoading = false;
      this.saved = true;
      setTimeout(() => {
        this.saved = false;
        this.saveProcess = false;
      }, 1000);
    });
  }

  exportToNewList = async (event: Event) => {
    event.stopPropagation();
    this.stores$ = this.storeService.getAllStores();
    this.modalOpen = true;
  }

  onSubmitExportForm = async () => {
    const name = this.exportForm.value.name;
    const storeId = this.exportForm.value.storeId;
    this.exportFormSubmitted = true;
    if (this.exportForm.invalid) return;
    const groceryList = await lastValueFrom(this.groceryListService.getGroceryList(this.id));
    this.ingredients$.pipe(take(1)).subscribe(ingredients => {
      const newList = { ...groceryList, name: name, storeId: storeId, ingredients: [...ingredients.filter(i => !i.selected)] };
      this.ngStore.dispatch(new AddGroceryList(newList)).subscribe(_ => {
        this.exportForm.reset();
        this.exportFormSubmitted = false;
        this.back();
      });
    });
  }

  initForm = () => {
    this.exportForm = new FormGroup({
      [GROCERY_LIST_FORM.NAME]: new FormControl('', Validators.required),
      [GROCERY_LIST_FORM.STORE_ID]: new FormControl(this.storeId ?? '')
    });
  }

  ngOnDestroy(): void {
    //this.ingredientService.setIngredients([]);
    if (this.itemAddedSubscription) {
      this.itemAddedSubscription.unsubscribe();
    }
    if (this.addFormClosedSubscription) {
      this.addFormClosedSubscription.unsubscribe();
    }
  }
}
