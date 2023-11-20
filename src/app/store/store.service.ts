import { HttpClient } from "@angular/common/http";
import { Injectable, inject } from "@angular/core";
import { Subject, lastValueFrom, map } from "rxjs";

@Injectable({ providedIn: 'root' })
export class StoreService {
    httpClient = inject(HttpClient);
    private storeUpdated = new Subject<Store[]>();
    storeUpdated$ = this.storeUpdated.asObservable();

    getAllStores = async () => {
        const stores = await lastValueFrom(this.httpClient.get<Store[]>('http://localhost:5058/api/stores'));
        this.storeUpdated.next([...stores]);
    }

    getStoreById = async (id: string) => {
        return this.httpClient.get<Store>(`http://localhost:5058/api/stores/${id}`);
    }
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