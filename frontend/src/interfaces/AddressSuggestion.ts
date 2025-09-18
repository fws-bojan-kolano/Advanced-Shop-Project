export interface AddressSuggestion {
    place_id: string;
    display_name: string;
    address?: {
        postcode?: string;
        country?: string;
    };
}