export interface User {
    id: string;
    username: string;
    password: string;
    role: string;
    email: string;
    cart: any[]; // TODO: replace any[] with Product[]
}