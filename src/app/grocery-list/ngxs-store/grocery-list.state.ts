import { State, Action, StateContext, Selector } from '@ngxs/store';
import { catchError, tap } from 'rxjs/operators';
import { inject } from '@angular/core';

import { GroceryList } from '../types/grocery-list.type';
import { GroceryListService } from '../grocery-list.service';
import { AddGroceryList, DeleteGroceryList, GetGroceryLists, SetSelectedGroceryList, UpdateGroceryList } from './grocery-list.actions';
import { Ingredient } from '../types/ingredient.type';
import { SetIngredients, SetSections } from './ingredient.actions';

export interface GroceryListStateModel {
    groceryLists: GroceryList[];
    selectedGroceryList: GroceryList | null;
    ingredients: Ingredient[]
}

@State<GroceryListStateModel>({
    name: 'groceryLists',
    defaults: {
        groceryLists: [],
        selectedGroceryList: null,
        ingredients: []
    }
})
export class GroceryListState {
    groceryListService = inject(GroceryListService);

    @Selector()
    static getGroceryLists(state: GroceryListStateModel) {
        return sortByDate(state.groceryLists);
    }

    @Selector()
    static getSelectedGroceryList(state: GroceryListStateModel) {
        return state.selectedGroceryList;
    }

    @Action(GetGroceryLists)
    getGroceryLists({ getState, setState }: StateContext<GroceryListStateModel>) {
        return this.groceryListService.getAllGroceryLists().pipe(tap((result) => {
            const state = getState();
            setState({
                ...state,
                groceryLists: result,
            });
        }));
    }

    @Action(AddGroceryList)
    addGroceryList({ getState, patchState }: StateContext<GroceryListStateModel>, { payload }: AddGroceryList) {
        let list;
        if ('storeId' in payload) {
            list = { id: '', name: payload.name, storeId: payload.storeId, ingredients: payload.ingredients };
        } else {
            list = { id: '', name: payload.name, storeId: payload.store?.id ?? '', ingredients: payload.ingredients };
        }
        return this.groceryListService.addGroceryList(list).pipe(tap((result) => {
            const state = getState();
            patchState({
                groceryLists: [...state.groceryLists, result]
            });
        }));
    }

    @Action(UpdateGroceryList)
    updateGroceryList({ getState, setState }: StateContext<GroceryListStateModel>, { payload, id }: UpdateGroceryList) {
        let list;
        if ('storeId' in payload) {
            list = { id: id, name: payload.name, storeId: payload.storeId, ingredients: payload.ingredients };
        } else {
            list = { id: id, name: payload.name, storeId: payload.store?.id ?? '', ingredients: payload.ingredients };
        }
        return this.groceryListService.updateGroceryList(id, list).pipe(tap((result) => {
            const state = getState();
            const groceryLists = [...state.groceryLists];
            const updatedGroceryListIndex = groceryLists.findIndex(item => item.id === id);
            groceryLists[updatedGroceryListIndex] = result;
            setState({
                ...state,
                groceryLists: groceryLists,
            });
        }));
    }


    @Action(DeleteGroceryList)
    deleteGroceryList({ getState, setState }: StateContext<GroceryListStateModel>, { id }: DeleteGroceryList) {
        return this.groceryListService.deleteGroceryList(id).pipe(tap(() => {
            const state = getState();
            const filteredArray = state.groceryLists.filter(item => item.id !== id);
            setState({
                ...state,
                groceryLists: filteredArray,
            });
        }));
    }

    @Action(SetSelectedGroceryList)
    setSelectedGroceryListId({ getState, setState, dispatch }: StateContext<GroceryListStateModel>, { payload }: SetSelectedGroceryList) {
        const state = getState();
        setState({
            ...state,
            selectedGroceryList: payload
        });

        dispatch(new SetIngredients(payload?.ingredients ?? []));
        dispatch(new SetSections(payload?.store?.sections ?? []));
    }
}

const sortByDate = (list: GroceryList[]): GroceryList[] => {
    return list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
};