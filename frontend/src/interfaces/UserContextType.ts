import type { User } from "./User";

export interface UserContextType {
    user: User | null;
    setUser: React.Dispatch<React.SetStateAction<User | null>>;
    updateUserCart: (updatedCart: User["cart"]) => void;
    productsMegamenu: any[]; // TODO: replace any[] with Product[]
    setProductsMegamenu: React.Dispatch<React.SetStateAction<any[]>>;
}