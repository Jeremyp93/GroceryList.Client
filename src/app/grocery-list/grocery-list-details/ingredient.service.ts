// ingredient.service.ts
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Ingredient } from '../grocery-list.service';
import { Section } from '../../stores/store.service';

@Injectable({
    providedIn: 'root'
})
export class IngredientService {
    private ingredientsSubject = new BehaviorSubject<Ingredient[]>([]);
    ingredients$ = this.ingredientsSubject.asObservable();
    private sections: Section[] = [];

    constructor() { }

    setSections = (sections: Section[]) => {
        this.sections = sections;
    }

    getIngredients = (): Ingredient[] => {
        return this.ingredientsSubject.value;
    }

    setIngredients = (ingredients: Ingredient[]): void => {
        this.ingredientsSubject.next(ingredients);
    }

    resetIngredients = () => {
        const ingredients = this.getIngredients();
        const resettedIngredients = ingredients.map(i => {
            return { ...i, inBasket: false }
        });
        this.setAndSortIngredientsByPriority(resettedIngredients);
    }

    putInBasket = (index: number): void => {
        const ingredients = this.getIngredients();
        if (ingredients[index].inBasket) return;
        const movedIngredient = ingredients.splice(index, 1)[0];
        ingredients.push({ ...movedIngredient, inBasket: true });
        this.setIngredients([...ingredients]);
    }

    setAndSortIngredientsByPriority = (ingredients: Ingredient[]): void => {
        if (this.sections.length == 0) {
            this.setIngredients([...ingredients]);
        }
        ingredients.sort((a, b) => {
            const priorityA = this.getSectionPriority(a.category);
            const priorityB = this.getSectionPriority(b.category);
            return priorityA - priorityB;
        });
        this.setIngredients([...ingredients]);
    }

    private getSectionPriority = (category: string | null): number => {
        const section = this.sections.find((s) => s.name === category);
        return section ? section.priority : 0;
    }
}