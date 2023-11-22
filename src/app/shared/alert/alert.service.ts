import { Injectable, signal, computed } from "@angular/core";
import { AlertMessage } from "./alert.type";
import { AlertType } from "./alert.enum";

@Injectable({ providedIn: 'root' })
export class AlertService {
    #alertMessages = signal<AlertMessage[]>([]);
    alertMessages = computed(this.#alertMessages);

    sendMessage(type: AlertType, message: string): void {
        this.#alertMessages.update(messages => [...messages, { type, message }]);
    }

    clearMessages(): void {
        this.#alertMessages.set([]);
    }
}