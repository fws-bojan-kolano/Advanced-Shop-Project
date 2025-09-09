import type { CartItem } from "./CartItem";
import type { Order } from "./Order";

export interface User {
    id: string;
    username: string;
    password: string;
    role: string;
    email: string;
    cart: CartItem[];
    orders: Order[];
}