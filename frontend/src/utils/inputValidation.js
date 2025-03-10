//Prevent special characters for inputs
export const preventInvalidNumberInput = (e) => {
    if(['e', 'E', '+', '-', '.'].includes(e.key)) {
        e.preventDefault();
    }
}

//Parse and sanitize input value
export const sanitizeNumberInput = (value) => {
    const numericValue = parseInt(value, 10);
    if (isNaN(numericValue) || numericValue < 0) return 0;
    return numericValue;
}