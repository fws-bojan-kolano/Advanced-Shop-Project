//Prevent special characters for inputs
export const preventInvalidNumberInput = (e: React.KeyboardEvent<HTMLInputElement>) => {
    const invalidKeys = ['e', 'E', '+', '-', '.']
    if(invalidKeys.includes(e.key)) {
        e.preventDefault();
    }
}

//Parse and sanitize input value
export const sanitizeNumberInput = (value: string | number): number => {
    const numericValue = typeof value === 'string' ? parseInt(value, 10) : value;
    if (isNaN(numericValue) || numericValue < 0) return 0;
    return numericValue;
};