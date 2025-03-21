//Prevent special characters for inputs
export const preventInvalidNumberInput = (e) => {
    const invalidKeys = ['e', 'E', '+', '-', '.']
    if(invalidKeys.includes(e.key)) {
        e.preventDefault();
    }
}

//Parse and sanitize input value
export const sanitizeNumberInput = (value) => {
    const numericValue = parseInt(value, 10);
    if (numericValue < 0) return 0;
    return numericValue;
}