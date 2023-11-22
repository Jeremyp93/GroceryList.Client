import { Store } from "../../store/types/store.type";
import { Ingredient } from "./ingredient.type";

export type GroceryList = {
    id: string;
    name: string;
    store: Store | null;
    ingredients: Ingredient[];
    createdAt: Date;
    showDelete: boolean;
}

export type GroceryListForm = {
    name: string;
    storeId: string;
    ingredients: Ingredient[];
}