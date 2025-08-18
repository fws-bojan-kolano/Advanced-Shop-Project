import User from './User';

export interface UserContextType {
    user: User | null;
    setUser: React.Dispatch<React.SetStateAction<User | null>>;
    updateUserCart: (updatedCart: User['cart']) => void;
    productsMegamenu: any[];
    setProductsMegamenu: React.Dispatch<React.SetStateAction<any[]>>;
}