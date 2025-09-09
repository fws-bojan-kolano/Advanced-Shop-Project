export type Product = {
    name: string;
    price: number;
    creator: string;
    description: string;
    image: string;
    recommended: 'yes' | 'no';
    category: string;
};