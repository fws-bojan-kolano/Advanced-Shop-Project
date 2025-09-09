import type { CartItem } from "./CartItem";

export interface Order {
    orderId: string;
    date: string;
    items: CartItem[];
    total: number;
    name: string;
    address: string;
    email: string;
    phone: string;
    zip: string;
    company?: string;
}