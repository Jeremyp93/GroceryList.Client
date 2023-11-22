import { Section } from "../../store/types/section.type";
import { Ingredient } from "../types/ingredient.type";


export class AddIngredient {
    static readonly type = '[Ingredient] Add';

    constructor(public payload: Ingredient) {
    }
}

export class DeleteIngredient {
    static readonly type = '[Ingredient] Delete';

    constructor(public id: string) {
    }
}

export class ResetIngredients {
    static readonly type = '[Ingredient] Reset';

    constructor() {
    }
}

export class SelectIngredient {
    static readonly type = '[Ingredient] Select';

    constructor(public index: number) {
    }
}

export class SaveIngredients {
    static readonly type = '[Ingredient] Save';

    constructor(public groceryListId: string) {
    }
}

export class SetIngredients {
    static readonly type = '[GroceryList] Set Ingredients For Selected List';

    constructor(public ingredients: Ingredient[]) { }
}

export class SetSections {
    static readonly type = '[GroceryList] Set Sections For Selected List';

    constructor(public sections: Section[]) { }
}