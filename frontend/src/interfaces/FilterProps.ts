export interface FilterState {
    categories: string[];
    priceMin: number | string;
    priceMax: number | string;
    creators: string[];
}

export interface FilterProps {
    filters: FilterState;
    setFilters: React.Dispatch<React.SetStateAction<FilterState>>;
    categories: string[];
    creators: string[];
}