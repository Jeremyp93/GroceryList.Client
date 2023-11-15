import { HttpClient } from "@angular/common/http";
import { Injectable, inject } from "@angular/core";
import { Subject, from, lastValueFrom, map, switchMap } from "rxjs";

@Injectable({ providedIn: 'root' })
export class GroceryListService {
    httpClient = inject(HttpClient);
    private groceryListUpdated = new Subject<GroceryList[]>();
    groceryListUpdated$ = this.groceryListUpdated.asObservable();
    private groceryLists: any[] = [];

    getAllGroceryLists = async () => {
        const stores = await lastValueFrom(this.httpClient.get<Store[]>('http://localhost:5058/api/stores'));
        this.httpClient.get<any[]>('http://localhost:5058/api/grocerylists').pipe(map((lists: any[]) => {
            return lists.map((l) => {
                return { ...l, store: stores.find(s => s.id === l.storeId) };
            });
        })).subscribe(response => {
            this.groceryLists = response;
            this.groceryListUpdated.next([...this.groceryLists]);
        });
    }

    getGroceryList = async (id: string) => {
        const stores = await lastValueFrom(this.httpClient.get<Store[]>('http://localhost:5058/api/stores'));
        return this.httpClient.get<any>(`http://localhost:5058/api/grocerylists/${id}`).pipe(map((list: any) => {
            return { ...list, store: stores.find(s => s.id === list.storeId) } as GroceryList;
        }));
    }
}

export type GroceryList = {
    id: string;
    name: string;
    store?: Store;
    ingredients: Ingredient[];
    createdAt: Date
}

export type Ingredient = {
    name: string;
    amount: number;
    category: string;
    inBasket: boolean;
}

export type Store = {
    id: string;
    name: string;
    street: string;
    city: string;
    state: string;
    country: string;
    zipCode: string;
    sections: Section[];
}

export type Section = {
    name: string;
    priority: number;
}