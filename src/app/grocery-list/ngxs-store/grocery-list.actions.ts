import { Section } from "../../store/types/section.type";
import { GroceryList, GroceryListForm } from "../types/grocery-list.type";
import { Ingredient } from "../types/ingredient.type";


export class AddGroceryList {
    static readonly type = '[GroceryList] Add';

    constructor(public payload: GroceryList | GroceryListForm) {
    }
}

export class GetGroceryLists {
    static readonly type = '[GroceryList] Get';
}

export class UpdateGroceryList {
    static readonly type = '[GroceryList] Update';

    constructor(public payload: GroceryList | GroceryListForm, public id: string) {
    }
}

export class DeleteGroceryList {
    static readonly type = '[GroceryList] Delete';

    constructor(public id: string) {
    }
}

export class SetSelectedGroceryList {
    static readonly type = '[GroceryList] Set';

    constructor(public payload: GroceryList | null) {
    }
}