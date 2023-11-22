import { Section } from "./section.type";

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