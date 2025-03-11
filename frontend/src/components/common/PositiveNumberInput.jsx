import React from 'react';
import { preventInvalidNumberInput, sanitizeNumberInput } from "../../utils/inputValidation";
import { useUser } from '../user/user-context';
import { Link } from 'react-router-dom';

export default function PositiveNumberInput({ value, onChange, onIncrement, onDecrement }) {
    const { user } = useUser();

    const handleChange = (e) => {
        console.log("handleChange called");  // This log will tell if the handler is firing
        const sanitizedValue = sanitizeNumberInput(e.target.value);
        console.log("Sanitized value in input:", sanitizedValue);
        onChange(sanitizedValue);  // Call the onChange handler from Product.jsx
    };

    const handleIncrement = () => {
        if (onIncrement) onIncrement();
    };

    const handleDecrement = () => {
        if (onDecrement) onDecrement();
    };

    if (!user) {
        return (
            <div className="add-to-cart not-logged-in">
                <p>Login to add to cart!</p>
                <Link className="hero-banner__link" to="/dashboard/login">Log in</Link>
            </div>
        )
    }

    return (
        <div className="add-to-cart">
            <span className="add-to-cart__inc-dec add-to-cart__dec" onClick={handleDecrement}>-</span>
            <input
                type="number"
                className="add-to-cart__input"
                value={value}  // Ensure this value is updated by the parent
                onChange={handleChange}  // Make sure this is being called on input change
                onKeyDown={preventInvalidNumberInput}
                min={0}
            />
            <span className="add-to-cart__inc-dec add-to-cart__inc" onClick={handleIncrement}>+</span>
        </div>
    );
}
