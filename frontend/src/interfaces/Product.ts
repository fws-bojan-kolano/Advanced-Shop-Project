export interface Product {
    id?: string | number;
    name: string;
    price: number;
    creator: string;
    description?: string;
    image?: string;
    recommended?: 'yes' | 'no' | boolean;
    category?: string;
};