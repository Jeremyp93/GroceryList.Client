import { Injectable, signal, computed } from "@angular/core";
import { AlertMessage } from "./alert.type";
import { AlertType } from "./alert.enum";
import { BehaviorSubject } from "rxjs";

@Injectable({ providedIn: 'root' })
export class AlertService {
    #alertMessages = new BehaviorSubject<AlertMessage[]>([]);
    alertMessages$ = this.#alertMessages.asObservable();

    sendMessage(type: AlertType, message: string): void {
        this.#alertMessages.next([...this.#alertMessages.getValue(), { type, message }]);
    }

    clearMessages(): void {
        this.#alertMessages.next([]);
    }
}