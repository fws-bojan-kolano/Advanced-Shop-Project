import type { User } from "./User";
import type { Product } from "./Product";

export interface UserContextType {
    user: User | null;
    setUser: React.Dispatch<React.SetStateAction<User | null>>;
    updateUserCart: (updatedCart: User["cart"]) => void;
    productsMegamenu: Product[];
    setProductsMegamenu: React.Dispatch<React.SetStateAction<Product[]>>;
}