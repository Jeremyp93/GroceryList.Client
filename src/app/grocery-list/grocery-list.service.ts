import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { Injectable, inject } from "@angular/core";
import { Observable, catchError, map, throwError } from "rxjs";
import { NIL as NIL_UUID } from 'uuid';

import { StoreService } from "../store/store.service";
import { GroceryListRequestDto, GroceryListResponseDto } from "./dtos/grocery-list-dto.type";
import { GroceryList } from "./types/grocery-list.type";
import { IngredientDto } from "./dtos/ingredient-dto.type";
import { Ingredient } from "./types/ingredient.type";
import { AlertService } from "../shared/alert/alert.service";
import { AlertType } from "../shared/alert/alert.enum";

@Injectable({ providedIn: 'root' })
export class GroceryListService {
    httpClient = inject(HttpClient);
    storeService = inject(StoreService);
    alertService = inject(AlertService);

    getAllGroceryLists = (): Observable<GroceryList[]> => {
        return this.httpClient.get<GroceryListResponseDto[]>('http://localhost:5058/api/grocerylists')
            .pipe(
                map((listsDto: GroceryListResponseDto[]) => {
                    // Map DTOs to application type
                    return listsDto.map((dto: GroceryListResponseDto) => (this.#fromDto(dto)));
                }),
                catchError(this.#handleError)
            );
    }

    getGroceryList = (id: string): Observable<GroceryList> => {
        return this.httpClient.get<GroceryListResponseDto>(`http://localhost:5058/api/grocerylists/${id}`).pipe(map((dto: GroceryListResponseDto) => {
            return this.#fromDto(dto);
        }), catchError(this.#handleError));
    }

    addGroceryList = (list: GroceryListRequestDto): Observable<GroceryList> => {
        if (!list.storeId) {
            list.storeId = NIL_UUID;
        }
        return this.httpClient.post<GroceryListResponseDto>('http://localhost:5058/api/grocerylists', list).pipe(map((createdListDto: GroceryListResponseDto) => {
            return this.#fromDto(createdListDto);
        }), catchError(this.#handleError));
    }

    deleteGroceryList = (id: string): Observable<void> => {
        return this.httpClient.delete<void>(`http://localhost:5058/api/grocerylists/${id}`).pipe(catchError(this.#handleError));
    }

    updateGroceryList = (id: string, list: GroceryListRequestDto): Observable<GroceryList> => {
        return this.httpClient.put<GroceryListResponseDto>(`http://localhost:5058/api/grocerylists/${id}`, list).pipe(map((updatedListDto: GroceryListResponseDto) => {
            return this.#fromDto(updatedListDto);
        }), catchError(this.#handleError));
    }

    updateIngredients = (id: string, ingredients: Ingredient[]): Observable<Ingredient[]> => {
        return this.httpClient.put<IngredientDto[]>(`http://localhost:5058/api/grocerylists/${id}/ingredients`, ingredients).pipe(map((ingredientsDto: IngredientDto[]) => {
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
        this.alertService.clearMessages();
        console.log(errorResponse);
        let errorMessage = 'An unknown error occured.';
        if (!errorResponse.error) {
            this.alertService.sendMessage(AlertType.Error, errorMessage);
            return throwError(() => new Error(errorMessage));
        }
        errorResponse.error.forEach((error: string) => {
            this.alertService.sendMessage(AlertType.Error, error);
        });
        errorMessage = errorResponse.error[0];
        return throwError(() => new Error(errorMessage));
    }
}



