import { HttpClient } from "@angular/common/http";
import { Injectable, inject } from "@angular/core";
import { Observable } from "rxjs";

import { Store } from "./types/store.type";

@Injectable({ providedIn: 'root' })
export class StoreService {
    httpClient = inject(HttpClient);

    getAllStores = (): Observable<Store[]> => {
        return this.httpClient.get<Store[]>('http://localhost:5058/api/stores');
    }

    getStoreById = (id: string): Observable<Store> => {
        return this.httpClient.get<Store>(`http://localhost:5058/api/stores/${id}`);
    }
}