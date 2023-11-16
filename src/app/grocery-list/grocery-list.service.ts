import { HttpClient } from "@angular/common/http";
import { Injectable, inject } from "@angular/core";
import { BehaviorSubject, Subject, lastValueFrom, map } from "rxjs";
import { Store, StoreService } from "../stores/store.service";

@Injectable({ providedIn: 'root' })
export class GroceryListService {
    httpClient = inject(HttpClient);
    storeService = inject(StoreService);
    private groceryListUpdated = new BehaviorSubject<GroceryList[]>([]);
    groceryListUpdated$ = this.groceryListUpdated.asObservable();

    getAllGroceryLists = async () => {
        const stores = await lastValueFrom(this.httpClient.get<Store[]>('http://localhost:5058/api/stores'));
        this.httpClient.get<any[]>('http://localhost:5058/api/grocerylists').pipe(map((lists: any[]) => {
            return lists.map((l) => {
                return { ...l, store: stores.find(s => s.id === l.storeId), showDelete: false };
            });
        })).subscribe(response => {
            this.groceryListUpdated.next([...response]);
        });
    }

    getGroceryList = async (id: string) => {
        const stores = await lastValueFrom(this.httpClient.get<Store[]>('http://localhost:5058/api/stores'));
        return this.httpClient.get<any>(`http://localhost:5058/api/grocerylists/${id}`).pipe(map((list: any) => {
            return { ...list, store: stores.find(s => s.id === list.storeId) } as GroceryList;
        }));
    }

    addGroceryList = async (list: GroceryList) => {
        console.log(list);
        let store: Store | null = null;
        if (list.storeId) {
            store = await lastValueFrom(await this.storeService.getStoreById(list.storeId));
        }
        list.storeId = list.storeId || null;

        list.ingredients.forEach(ingr => {
            ingr.category = ingr.category || null;
        });

        this.httpClient.post<any>('http://localhost:5058/api/grocerylists', list).pipe(map((list: any) => {
            return { ...list, store: store } as GroceryList;
        })).subscribe((response) => {
            const lists = [...this.groceryListUpdated.value];
            lists.push(response);
            this.groceryListUpdated.next([...lists]);
        });
    }
}

export type GroceryList = {
    id: string;
    name: string;
    storeId: string | null;
    store?: Store;
    ingredients: Ingredient[];
    createdAt: Date;
    showDelete: boolean;
}

export type Ingredient = {
    id: string;
    name: string;
    amount: number;
    category: string | null;
    inBasket: boolean;
}