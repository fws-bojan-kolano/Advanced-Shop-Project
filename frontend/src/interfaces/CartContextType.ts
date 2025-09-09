import type { CartItem } from "./CartItem";

export interface CartContextType {
    cart: CartItem[];
    addToCart: (product: CartItem, newQuantity: number) => void;
    removeFromCart: (productId: string | number, newQuantity?: number | null) => void;
    setCart: React.Dispatch<React.SetStateAction<CartItem[]>>;
}