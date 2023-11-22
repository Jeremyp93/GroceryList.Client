import { Store } from "../../store/types/store.type";
import { IngredientDto } from "./ingredient-dto.type";

export type GroceryListResponseDto = {
    id: string;
    name: string;
    store: Store | null;
    ingredients: IngredientDto[];
    createdAt: Date;
}

export type GroceryListRequestDto = {
    id: string;
    name: string;
    storeId: string;
    ingredients: IngredientDto[];
}
