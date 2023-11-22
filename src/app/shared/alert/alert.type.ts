import { AlertType } from "./alert.enum";

export type AlertMessage = {
    type: AlertType;
    message: string;
}