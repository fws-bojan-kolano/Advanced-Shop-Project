import type { Cart } from "./Cart";

export interface CartContextType {
    cart: Cart[];
    addToCart: (product: Cart, newQuantity: number) => void;
    removeFromCart: (productId: string | number, newQuantity?: number | null) => void;
    setCart: React.Dispatch<React.SetStateAction<Cart[]>>;
}