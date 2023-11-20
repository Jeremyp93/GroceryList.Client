// ingredient.service.ts
import { Injectable, inject } from '@angular/core';
import { BehaviorSubject, lastValueFrom } from 'rxjs';
import { GroceryListService, Ingredient } from '../grocery-list.service';
import { Section } from '../../store/store.service';

@Injectable({
    providedIn: 'root'
})
export class IngredientService {
    groceryListService = inject(GroceryListService);
    private ingredientsSubject = new BehaviorSubject<Ingredient[]>([]);
    ingredients$ = this.ingredientsSubject.asObservable();
    private sections: Section[] = [];

    constructor() { }

    setSections = (sections: Section[]) => {
        this.sections = sections;
    }

    getSections = () => {
        return [...this.sections];
    }

    getIngredients = (): Ingredient[] => {
        return this.ingredientsSubject.value;
    }

    setIngredients = (ingredients: Ingredient[]): void => {
        this.ingredientsSubject.next(ingredients);
    }

    deleteIngredient = (id: string) => {
        const ingredients = [...this.getIngredients()];
        const index = ingredients.findIndex(i => i.id === id);
        ingredients.splice(index, 1);
        this.ingredientsSubject.next(ingredients);
    }

    resetIngredients = () => {
        const ingredients = this.getIngredients();
        const resettedIngredients = ingredients.map(i => {
            return { ...i, selected: false }
        });
        this.setAndSortIngredientsByPriority(resettedIngredients);
    }

    putInBasket = (index: number): void => {
        const ingredients = this.getIngredients();
        if (ingredients[index].selected) return;
        const movedIngredient = ingredients.splice(index, 1)[0];
        ingredients.push({ ...movedIngredient, selected: true });
        this.setIngredients([...ingredients]);
    }

    setAndSortIngredientsByPriority = (ingredients: Ingredient[]): void => {
        if (this.sections.length == 0) {
            this.setIngredients([...ingredients]);
        }
        ingredients.sort((a, b) => {
            const priorityA = this.getSectionPriority(a.category);
            const priorityB = this.getSectionPriority(b.category);
            if (priorityA === 0 && priorityB === 0) {
                return 0; // Maintain original order for both null categories
            } else if (priorityA === 0) {
                return 1; // Place items with null category at the end
            } else if (priorityB === 0) {
                return -1; // Place items with null category at the end
            }
            return priorityA - priorityB;
        });
        this.setIngredients([...ingredients]);
    }

    saveIngredients = async (groceryListId: string) => {
        const newIngredients = await lastValueFrom(this.groceryListService.updateIngredients(groceryListId, [...this.getIngredients()]));
    }

    addIngredient = (ingredient: Ingredient) => {
        const ingredients = [...this.getIngredients()];
        ingredients.push({ ...ingredient, id: this.generateGUID() })
        this.setAndSortIngredientsByPriority(ingredients);
    }

    private getSectionPriority = (category: string | null): number => {
        const section = this.sections.find((s) => s.name === category);
        return section ? section.priority : 0;
    }

    private generateGUID = (): string => {
        const randomHex = () => Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
        return `${randomHex()}${randomHex()}-${randomHex()}-4${randomHex().substr(0, 3)}-${randomHex()}-${randomHex()}${randomHex()}${randomHex()}`;
    }
}