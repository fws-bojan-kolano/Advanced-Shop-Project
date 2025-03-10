import React, {useEffect, useState} from 'react';
import { preventInvalidNumberInput, sanitizeNumberInput } from "../../utils/inputValidation";

export default function PositiveNumberInput({value, onChange, onIncrement, onDecrement}) {
    const [isLoading, setIsLoading] = useState(false);
    const [debouncerTimer, setDebouncerTimer] = useState(null);

    const handleChange = (e) => {
        const sanitizedValue = sanitizeNumberInput(e.target.value);
        onChange(sanitizedValue);
        triggerDebounce();
    };

    const triggerDebounce = () => {
        if(debouncerTimer) {
            clearTimeout(debouncerTimer);
        }

        setIsLoading(true);
        const timer = setTimeout(() => {
            setIsLoading(false);
        }, 1000);
        setDebouncerTimer(timer);
    }

    return (
        <div className="add-to-cart">
            <span className="add-to-cart__inc-dec add-to-cart__dec" onClick={onDecrement}>-</span>
            <input
            type="number"
            className="add-to-cart__input"
            value={value}
            onChange={handleChange}
            onKeyDown={preventInvalidNumberInput}
            min={0}/>
            <span className="add-to-cart__inc-dec add-to-cart__inc" onClick={onIncrement}>+</span>
            {isLoading && <span className="loading-indicator">Updating...</span>}
        </div>
    )
}