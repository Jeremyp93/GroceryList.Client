import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { Injectable, inject } from "@angular/core";
import { Observable, catchError, map, throwError } from "rxjs";
import { NIL as NIL_UUID } from 'uuid';

import { StoreService } from "../store/store.service";
import { GroceryListRequestDto, GroceryListResponseDto } from "./dtos/grocery-list-dto.type";
import { GroceryList } from "./types/grocery-list.type";
import { IngredientDto } from "./dtos/ingredient-dto.type";
import { Ingredient } from "./types/ingredient.type";
import { environment } from "../../../src/environments/environment";

@Injectable({ providedIn: 'root' })
export class GroceryListService {
    httpClient = inject(HttpClient);
    storeService = inject(StoreService);

    getAllGroceryLists = (): Observable<GroceryList[]> => {
        return this.httpClient.get<GroceryListResponseDto[]>(environment.groceryListApiUrl)
            .pipe(
                map((listsDto: GroceryListResponseDto[]) => {
                    // Map DTOs to application type
                    return listsDto.map((dto: GroceryListResponseDto) => (this.#fromDto(dto)));
                }),
                catchError(this.#handleError)
            );
    }

    getGroceryList = (id: string): Observable<GroceryList> => {
        return this.httpClient.get<GroceryListResponseDto>(`${environment.groceryListApiUrl}/${id}`).pipe(map((dto: GroceryListResponseDto) => {
            return this.#fromDto(dto);
        }), catchError(this.#handleError));
    }

    addGroceryList = (list: GroceryListRequestDto): Observable<GroceryList> => {
        if (!list.storeId) {
            list.storeId = NIL_UUID;
        }
        return this.httpClient.post<GroceryListResponseDto>(environment.groceryListApiUrl, list).pipe(map((createdListDto: GroceryListResponseDto) => {
            return this.#fromDto(createdListDto);
        }), catchError(this.#handleError));
    }

    deleteGroceryList = (id: string): Observable<void> => {
        return this.httpClient.delete<void>(`${environment.groceryListApiUrl}/${id}`).pipe(catchError(this.#handleError));
    }

    updateGroceryList = (id: string, list: GroceryListRequestDto): Observable<GroceryList> => {
        return this.httpClient.put<GroceryListResponseDto>(`${environment.groceryListApiUrl}/${id}`, list).pipe(map((updatedListDto: GroceryListResponseDto) => {
            return this.#fromDto(updatedListDto);
        }), catchError(this.#handleError));
    }

    updateIngredients = (id: string, ingredients: Ingredient[]): Observable<Ingredient[]> => {
        return this.httpClient.put<IngredientDto[]>(`${environment.groceryListApiUrl}/${id}/ingredients`, ingredients).pipe(map((ingredientsDto: IngredientDto[]) => {
            return ingredientsDto.map((dto: IngredientDto) => (this.#fromIngredientDto(dto)));
        }), catchError(this.#handleError));
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

    #handleError = (errorResponse: HttpErrorResponse) => {
        let errorMessage = 'An unknown error occured.';
        if (!Array.isArray(errorResponse.error)) {
            return throwError(() => new Error(errorMessage));
        }

        errorMessage = errorResponse.error[0];
        return throwError(() => new Error(errorMessage));
    }
}



