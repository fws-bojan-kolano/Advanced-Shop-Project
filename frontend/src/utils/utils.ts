export const SERVER: string = "http://localhost:3001/";// Server

export type SortValue = "asc" | "desc" | "price_low" | "price_high";

export const SORT_OPTIONS: {label: string, value: SortValue}[] = [
    { label: 'Ascending', value: 'asc' },
    { label: 'Descending', value: 'desc' },
    { label: 'Lowest price', value: 'price_low' },
    { label: 'Highest price', value: 'price_high' }
];