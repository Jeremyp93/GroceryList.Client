import { HttpClient } from "@angular/common/http";
import { Injectable, inject } from "@angular/core";
import { Observable, map } from "rxjs";
import { NIL as NIL_UUID } from 'uuid';

import { StoreService } from "../store/store.service";
import { GroceryListRequestDto, GroceryListResponseDto } from "./dtos/grocery-list-dto.type";
import { GroceryList, GroceryListForm } from "./types/grocery-list.type";
import { IngredientDto } from "./dtos/ingredient-dto.type";
import { Ingredient } from "./types/ingredient.type";

@Injectable({ providedIn: 'root' })
export class GroceryListService {
    httpClient = inject(HttpClient);
    storeService = inject(StoreService);

    getAllGroceryLists = (): Observable<GroceryList[]> => {
        return this.httpClient.get<GroceryListResponseDto[]>('http://localhost:5058/api/grocerylists')
            .pipe(
                map((listsDto: GroceryListResponseDto[]) => {
                    // Map DTOs to application type
                    return listsDto.map((dto: GroceryListResponseDto) => (this.#fromDto(dto)));
                })
            );
    }

    getGroceryList = (id: string): Observable<GroceryList> => {
        return this.httpClient.get<GroceryListResponseDto>(`http://localhost:5058/api/grocerylists/${id}`).pipe(map((dto: GroceryListResponseDto) => {
            return this.#fromDto(dto);
        }));
    }

    addGroceryList = (list: GroceryListRequestDto): Observable<GroceryList> => {
        return this.httpClient.post<GroceryListResponseDto>('http://localhost:5058/api/grocerylists', list).pipe(map((createdListDto: GroceryListResponseDto) => {
            return this.#fromDto(createdListDto);
        }));
    }

    deleteGroceryList = (id: string): Observable<void> => {
        return this.httpClient.delete<void>(`http://localhost:5058/api/grocerylists/${id}`);
    }

    updateGroceryList = (id: string, list: GroceryListRequestDto): Observable<GroceryList> => {
        return this.httpClient.put<GroceryListResponseDto>(`http://localhost:5058/api/grocerylists/${id}`, list).pipe(map((updatedListDto: GroceryListResponseDto) => {
            return this.#fromDto(updatedListDto);
        }));
    }

    updateIngredients = (id: string, ingredients: Ingredient[]): Observable<Ingredient[]> => {
        return this.httpClient.put<IngredientDto[]>(`http://localhost:5058/api/grocerylists/${id}/ingredients`, ingredients).pipe(map((ingredientsDto: IngredientDto[]) => {
            return ingredientsDto.map((dto: IngredientDto) => (this.#fromIngredientDto(dto)));
        }));
    }

    #toDto = (groceryList: GroceryList): GroceryListRequestDto => {
        return {
            id: groceryList.id,
            name: groceryList.name,
            storeId: groceryList.store?.id ?? NIL_UUID,
            ingredients: groceryList.ingredients.map(i => ({ id: i.id, name: i.name, amount: i.amount, category: i.category }))
        };
    }

    #fromDto = (dto: GroceryListResponseDto): GroceryList => {
        return {
            id: dto.id,
            name: dto.name,
            store: dto.store,
            ingredients: dto.ingredients.map(i => ({ id: i.id, name: i.name, amount: i.amount, category: i.category, selected: false })),
            createdAt: dto.createdAt,
            showDelete: false
        };
    }

    #fromIngredientDto = (dto: IngredientDto): Ingredient => {
        return {
            id: dto.id,
            name: dto.name,
            amount: dto.amount,
            category: dto.category,
            selected: false
        };
    }
}



