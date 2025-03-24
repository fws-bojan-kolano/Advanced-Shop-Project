import React from 'react';
import { preventInvalidNumberInput } from "../../utils/inputValidation";
import { useUser } from '../user/user-context';
import { Link } from 'react-router-dom';

export default function PositiveNumberInput({ value, onChange, onIncrement, onDecrement }) {
    const { user } = useUser();

    const handleChange = (e) => onChange(e.target.value);

    const handleIncrement = () => {
        if (onIncrement) onIncrement();
    };

    const handleDecrement = () => {
        if (onDecrement) onDecrement();
    };

    const handleClassChange = (e) => {
        const clickedItemParent = e.target.parentNode;
        clickedItemParent.classList.add('active');
    }

    if (!user) {
        return (
            <div className="add-to-cart not-logged-in">
                <p className='add-to-cart__log-in' onClick={handleClassChange}>Login to add to cart!</p>
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
                value={value}
                onChange={handleChange}
                onKeyDown={preventInvalidNumberInput}
                min={0}
            />
            <span className="add-to-cart__inc-dec add-to-cart__inc" onClick={handleIncrement}>+</span>
        </div>
    );
}
