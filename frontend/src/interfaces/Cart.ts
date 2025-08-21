import type { User } from "./User";

export interface Cart extends User {
    id: string | number;
    name: string;
    price: number;
    quantity: number;
}