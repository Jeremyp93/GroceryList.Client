import { State, Action, StateContext, Selector } from '@ngxs/store';
import { tap } from 'rxjs';
import { Injectable, inject } from '@angular/core';
import { v4 as UUID } from 'uuid';

import { Ingredient } from '../types/ingredient.type';
import { AddIngredient, DeleteIngredient, ResetIngredients, SaveIngredients, SelectIngredient, SetIngredients, SetSections } from './ingredient.actions';
import { GroceryListService } from '../grocery-list.service';
import { Section } from '../../store/types/section.type';

export interface IngredientStateModel {
    ingredients: Ingredient[];
    sections: Section[]
}

@State<IngredientStateModel>({
    name: 'ingredients',
    defaults: {
        ingredients: [],
        sections: []
    },
})
export class IngredientState {
    groceryListService = inject(GroceryListService);

    @Selector()
    static getIngredients(state: IngredientStateModel) {
        return sortIngredientsByPriority(state.ingredients, state.sections);
    }

    @Selector()
    static getSections(state: IngredientStateModel) {
        return state.sections;
    }

    @Action(SetIngredients)
    setIngredients({ getState, setState }: StateContext<IngredientStateModel>, { ingredients }: SetIngredients) {
        const state = getState();
        setState({
            ...state,
            ingredients: ingredients,
        });
    }

    @Action(SetSections)
    setSections({ getState, setState }: StateContext<IngredientStateModel>, { sections }: SetSections) {
        const state = getState();
        setState({
            ...state,
            sections: sections,
        });
    }

    @Action(AddIngredient)
    addIngredient({ getState, patchState }: StateContext<IngredientStateModel>, { payload }: AddIngredient) {
        const state = getState();
        const ingredients = [...state.ingredients];
        ingredients.push({ ...payload, id: UUID() })
        patchState({
            ingredients: [...state.ingredients, payload]
        });
    }

    @Action(DeleteIngredient)
    deleteIngredient({ getState, setState }: StateContext<IngredientStateModel>, { id }: DeleteIngredient) {
        const state = getState();
        const filteredArray = state.ingredients.filter(item => item.id !== id);
        setState({
            ...state,
            ingredients: filteredArray,
        });
    }

    @Action(ResetIngredients)
    resetIngredients({ getState, setState }: StateContext<IngredientStateModel>, { }: ResetIngredients) {
        const state = getState();
        const resettedIngredients = [...state.ingredients].map(i => {
            return { ...i, selected: false }
        });
        setState({
            ...state,
            ingredients: resettedIngredients
        });
    }

    @Action(SelectIngredient)
    selectIngredient({ getState, setState }: StateContext<IngredientStateModel>, { index }: SelectIngredient) {
        const state = getState();
        const ingredients = [...state.ingredients];
        if (ingredients[index].selected) return;
        const movedIngredient = ingredients.splice(index, 1)[0];
        ingredients.push({ ...movedIngredient, selected: true });
        setState({
            ...state,
            ingredients: ingredients,
        });
    }

    @Action(SaveIngredients)
    saveIngredients({ getState, patchState }: StateContext<IngredientStateModel>, { groceryListId }: SaveIngredients) {
        const state = getState();
        return this.groceryListService.updateIngredients(groceryListId, [...state.ingredients]).pipe(tap((savedIngredients) => {
            patchState({
                ingredients: savedIngredients,
            });
        }));
    }
}

const sortIngredientsByPriority = (ingredients: Ingredient[], sections: Section[]): Ingredient[] => {
    if (sections.length === 0) {
        return ingredients;
    }
    ingredients.sort((a, b) => {
        const priorityA = getSectionPriority(a.category, sections);
        const priorityB = getSectionPriority(b.category, sections);
        if (b.selected) return -1;
        if (priorityA === 0 && priorityB === 0) {
            return 0; // Maintain original order for both null categories
        } else if (priorityA === 0) {
            return 1; // Place items with null category at the end
        } else if (priorityB === 0) {
            return -1; // Place items with null category at the end
        }
        return priorityA - priorityB;
    });
    return ingredients;
}

const getSectionPriority = (category: string | null, sections: Section[]): number => {
    const section = sections.find((s) => s.name === category);
    return section ? section.priority : 0;
}