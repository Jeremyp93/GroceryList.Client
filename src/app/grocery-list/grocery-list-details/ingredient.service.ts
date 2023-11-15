// ingredient.service.ts
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Ingredient, Section } from '../grocery-list.service';

@Injectable({
    providedIn: 'root'
})
export class IngredientService {
    private ingredientsSubject = new BehaviorSubject<Ingredient[]>([]);
    ingredients$ = this.ingredientsSubject.asObservable();

    constructor() { }

    getIngredients = (): Ingredient[] => {
        return this.ingredientsSubject.value;
    }

    setIngredients = (ingredients: Ingredient[]): void => {
        this.ingredientsSubject.next(ingredients);
    }

    /* moveToEnd = (index: number): void => {
        const ingredients = this.getIngredients();
        const movedIngredient = ingredients.splice(index, 1)[0];
        ingredients.push(movedIngredient);
        this.setIngredients([...ingredients]);
    } */

    putInBasket = (index: number): void => {
        const ingredients = this.getIngredients();
        if (ingredients[index].inBasket) return;
        const movedIngredient = ingredients.splice(index, 1)[0];
        ingredients.push({ ...movedIngredient, inBasket: true });
        this.setIngredients([...ingredients]);
    }

    setAndSortIngredientsByPriority = (ingredients: Ingredient[], sections: Section[] | undefined): void => {
        if (!sections) {
            this.setIngredients([...ingredients]);
        }
        ingredients.sort((a, b) => {
            const priorityA = this.getSectionPriority(a.category, sections!);
            const priorityB = this.getSectionPriority(b.category, sections!);
            return priorityA - priorityB;
        });
        this.setIngredients([...ingredients]);
    }

    private getSectionPriority = (category: string, sections: Section[]): number => {
        const section = sections.find((s) => s.name === category);
        return section ? section.priority : 0;
    }
}