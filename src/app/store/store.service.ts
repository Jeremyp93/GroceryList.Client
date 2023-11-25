import { HttpClient } from "@angular/common/http";
import { Injectable, inject } from "@angular/core";
import { Observable } from "rxjs";

import { Store } from "./types/store.type";
import { environment } from "../../../src/environments/environment";

@Injectable({ providedIn: 'root' })
export class StoreService {
    httpClient = inject(HttpClient);

    getAllStores = (): Observable<Store[]> => {
        return this.httpClient.get<Store[]>(environment.storeApiUrl);
    }

    getStoreById = (id: string): Observable<Store> => {
        return this.httpClient.get<Store>(`${environment.storeApiUrl}/${id}`);
    }
}