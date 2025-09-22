import React, { useCallback, useEffect, useState, useContext } from 'react';
import { useCart } from '../cart/cart-context';
import { Link, useNavigate } from "react-router-dom";
import { UserContext } from "../user/user-context";
import './checkout.scss';
import { SERVER } from '../../utils/utils';
import type { UserContextType } from '../../interfaces/UserContextType';
import type { AddressSuggestion } from '../../interfaces/AddressSuggestion';

interface FormErrors {
    name: string;
    email: string;
    phone: string;
    address: string;
    zip: string;
    company: string;
}

export default function Checkout() {
    const [address, setAddress] = useState<string>('');
    const [zip, setZip] = useState<string>('');
    const [shippingCost, setShippingCost] = useState<number>(0);
    const [suggestions, setSuggestions] = useState<AddressSuggestion[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [showLoaderAddress, setShowLoaderAddress] = useState(false);
    const [showLoaderSubmit, setShowLoaderSubmit] = useState(false);
    const [couponCode, setCouponCode] = useState('');
    const [couponDiscount, setCouponDiscount] = useState(0);
    const [couponError, setCouponError] = useState('');
    const [showCoupon, setShowCoupon] = useState(false);
    const [formErrors, setFormErrors] = useState<FormErrors>({
        name: '',
        email: '',
        phone: '',
        address: '',
        zip: '',
        company: ''
    });
    const { user, setUser } = useContext(UserContext) as UserContextType;
    const {cart} = useCart();
    const cartItems = cart.filter(item => item.quantity > 0);
    const subtotal = cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
    const total = couponDiscount > 0 ? (subtotal + shippingCost) - ((subtotal + shippingCost) * (couponDiscount / 100)) : (subtotal + shippingCost);
    const validCoupons: Record<string, number> = {
        'DISCOUNT10': 10, // 10% discount
        'SAVE20': 20 // 20% discount
    }

    useEffect(() => {
        const submit = document.querySelector('.js-checkout__submit-wrapper');
        const checkoutInfo = document.querySelector('.js-checkout__info');
        if(submit && checkoutInfo) checkoutInfo.appendChild(submit);
    }, [])

    const navigate = useNavigate();

    const handleToggleCoupon = () => {
        setShowCoupon(!showCoupon);
    }

    const handleApplyCoupon = () => {
        if(validCoupons[couponCode]) {
            setCouponDiscount(validCoupons[couponCode]);
            setCouponError('');
        } else {
            setCouponError('Invalid coupon code');
            setCouponDiscount(0);
        }
    }

    const debounce = <T extends unknown[]>(
        func: (...args: T) => void,
        delay: number
    ) => {
        let timer: number;
        return (...args: T) => {
            clearTimeout(timer);
            timer = window.setTimeout(() => func(...args), delay);
        };
    };

    const fetchAddressSuggestions = async (query: string) => {
        if(query.length < 3) {
            setSuggestions([]);
            setShowLoaderAddress(false);
            setError(null);
            return;
        }

        setShowLoaderAddress(true);

        try {
            const url = `https://nominatim.openstreetmap.org/search?format=json&addressdetails=1&q=${encodeURIComponent(query)}`;
            const response = await fetch(url);
            if(!response.ok) throw new Error("Failed to fetch!");

            const data = await response.json();
            setSuggestions(data);
            setError(null);
        } catch (error) {
            console.error("Error fetching address suggestions:", error);
            setError("Address suggestions could not be loaded.");
        } finally {
            setShowLoaderAddress(false);
        }
    }

    const debouncedFetch = useCallback(debounce(fetchAddressSuggestions, 500), []);

    const handleSelectAddress = (place: AddressSuggestion) => {
        setAddress(place.display_name);
        setSuggestions([]);

        if(place.address && place.address.postcode) setZip(place.address.postcode || '');
        if(place.address && place.address.country) calculateShipping(place.address.country);
    }

    const fetchNeighboringCountries = async (selectedCountry: string) => {
        try {
            const response = await fetch(`https://restcountries.com/v3.1/name/${selectedCountry}?fields=borders`);
            if(!response.ok) throw new Error('Failed to fetch neighboring countries');

            const data = await response.json();
            return data[0]?.borders || [];
        } catch (error) {
            console.error('Error fetching neighboring countries: ', error);
            return [];
        }
    }

    const calculateShipping = async (selectedCountry: string) => {
        if(!selectedCountry) return;

        let cost = 25; //Default international shipping cost
        if(selectedCountry === 'Serbia') {
            cost = 5; //Same country shipping
        } else {
            const neighbors = await fetchNeighboringCountries(selectedCountry);
            if(neighbors.includes('SRB')) cost = 15; // Shipping costs 15$ if Serbian neighbor
        }

        setShippingCost(cost);
    }

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setShowLoaderSubmit(true);

        const errors: FormErrors = {
            name: '',
            email: '',
            phone: '',
            address: '',
            zip: '',
            company: ''
        };
        const nameRegex = /^[a-zA-Z]+\s+[a-zA-Z]+$/;
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const phoneRegex = /^[0-9\s+()-]{6,}$/;

        const form = e.target as HTMLFormElement;
        const nameValue = (form.elements.namedItem('name') as HTMLInputElement)?.value || '';
        const emailValue = (form.elements.namedItem('email') as HTMLInputElement)?.value || '';
        const phoneValue = (form.elements.namedItem('phone') as HTMLInputElement)?.value || '';
        const companyValue = (form.elements.namedItem('company') as HTMLInputElement)?.value || '';

        !nameRegex.test(nameValue.trim()) ? errors.name = 'Enter correct first and last name.' : null;
        !emailRegex.test(emailValue.trim()) ? errors.email = 'Enter correct email.' : null;
        !phoneRegex.test(phoneValue.trim()) ? errors.phone = 'Enter correct phone.' : null;
        !address.trim() ? errors.address = 'Enter correct address.' : null;
        !zip.trim() ? errors.zip = 'Enter correct ZIP.' : null;
        !companyValue.trim() ? errors.company = 'Enter correct company name.' : null;

        setFormErrors(errors);

        const hasErrors = Object.values(errors).some(errorMsg => errorMsg !== '');

        if(!hasErrors) {
            const order = {
                firstAndLastName: nameValue,
                checkoutEmail: emailValue,
                phone: phoneValue,
                address: address,
                zip: zip,
                company: companyValue,
                total: total
            }

            try {
                const response: Response = await fetch(`${SERVER}users/${user?.id}/checkout`, {
                    method: 'PUT',
                    headers: {'Content-Type': 'application/json'},
                    body: JSON.stringify(order)
                });

                if(!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }

                const result = await response.json();
                if(result.success) {
                    if(result.user) {
                        setUser(result.user);
                    } else {
                        setUser(prevUser => prevUser ? ({
                            ...prevUser,
                            order: result.order,
                            orders: result.orders
                        }) : null);
                    }

                    navigate('/thank-you');
                }
            } catch (error) {
                console.error('Error during data update:', error);
            } finally {
                setShowLoaderSubmit(false);
            }
        } else {
            const firstErrorField = Object.keys(errors).find(key => errors[key as keyof FormErrors] !== '');
            const el = document.querySelector(`[name="${firstErrorField}"]`);
            el ? el.scrollIntoView({behavior: 'smooth', block: 'center'}) : null;
            setShowLoaderSubmit(false);
        }
    }

    return (
        <div className="checkout">
            <div className="container">
                <h1 className="page-title checkout__title">Checkout</h1>
                <div className="checkout__wrapper">
                    {cartItems.length === 0 ? (
                        <p>Your cart is empty! 
                            <Link to='/shop'>Continue Shopping</Link>
                        </p>) : (
                        <div className="checkout__box">
                            <form className="checkout__form" id='checkout-form' onSubmit={handleSubmit}>
                                <div className="checkout__form-fields">
                                    <div className="input-wrapper">
                                        <input type="text" className="form-input" name='name' placeholder="First and Last name" />
                                        {formErrors.name && <span className="form-message form-error form-input-error">{formErrors.name}</span>}
                                    </div>
                                    <div className="input-wrapper">
                                        <input type="email" className="form-input" name='email' placeholder="Email" />
                                        {formErrors.email && <span className="form-message form-error form-input-error">{formErrors.email}</span>}
                                    </div>
                                    <div className="input-wrapper">
                                        <input type="text" className="form-input" name='phone' placeholder="Phone" />
                                        {formErrors.phone && <span className="form-message form-error form-input-error">{formErrors.phone}</span>}
                                    </div>
                                    <div className="input-wrapper">
                                        <input
                                            type="text"
                                            className="form-input"
                                            name='address'
                                            placeholder="Enter Address"
                                            value={address}
                                            onChange={e => {
                                                setAddress(e.target.value);
                                                debouncedFetch(e.target.value)}
                                            } />
                                        {showLoaderAddress && <span className='loader my-account__loader'></span>}
                                        {error && <p className="error-message">{error}</p>}
                                        {!showLoaderAddress && suggestions.length > 0 && (
                                            <ul className="input-wrapper__suggestions" id="suggestions">
                                                {suggestions.map(place => (
                                                    <li
                                                        key={place.place_id}
                                                        className="input-wrapper__suggestions-item"
                                                        onClick={() => handleSelectAddress(place)}>{place.display_name}
                                                    </li>
                                                ))}
                                            </ul>
                                        )}
                                        {formErrors.address && <span className="form-message form-error form-input-error">{formErrors.address}</span>}
                                    </div>
                                    <div className="input-wrapper">
                                        <input
                                            type="text"
                                            className="form-input"
                                            placeholder="ZIP"
                                            name='zip'
                                            value={zip}
                                            onChange={(e) => setZip(e.target.value)}
                                            />
                                        {formErrors.zip && <span className="form-message form-error form-input-error">{formErrors.zip}</span>}
                                    </div>
                                    <div className="input-wrapper">
                                        <input type="text" className="form-input" name='company' placeholder="Company name" />
                                        {formErrors.company && <span className="form-message form-error form-input-error">{formErrors.company}</span>}
                                    </div>
                                    <div className="input-wrapper checkout__submit-wrapper js-checkout__submit-wrapper">
                                        <input
                                        className='checkout__form-submit'
                                        type="submit"
                                        value="Place Order"
                                        onClick={() => {
                                            const form = document.getElementById('checkout-form') as HTMLFormElement | null;
                                            if (form) {
                                                form.requestSubmit();
                                            }
                                        }} />
                                        {showLoaderSubmit && <span className='loader my-account__loader'></span>}
                                    </div>
                                </div>
                            </form>
                            <div className="checkout__info js-checkout__info">
                                <ul className="checkout__info-products">
                                    {cartItems.map(item => (
                                        <li className="checkout__info-product" key={item.id}>
                                            <Link className='checkout__info-product-link' to={`/product/${item.id}`}>
                                                <div className="checkout__info-product-image-box">
                                                    <img className='checkout__info-product-image' src={item.image} alt={item.name} />
                                                    <p className="checkout__info-product-title">{item.name}</p>
                                                </div>
                                                <div className="checkout__info-product-price-box">
                                                    <span className="checkout__info-product-quantity">Quantity: ${item.quantity}</span>
                                                    <span className="checkout__info-product-price">Price: ${item.price}</span>
                                                </div>
                                            </Link>
                                        </li>
                                    ))}
                                </ul>
                                <div className="checkout__info-sub-total">
                                    <ul className="checkout__info-sub-total-items">
                                        <li className="checkout__info-sub-total-item">
                                            <span className="checkout__info-sub-total-item-left">Subtotal</span>
                                            <span className="checkout__info-sub-total-item-right">${subtotal}</span>
                                        </li>
                                        <li className="checkout__info-sub-total-item">
                                            <span className="checkout__info-sub-total-item-left">Shipping</span>
                                            <span className="checkout__info-sub-total-item-right">${shippingCost}</span>
                                        </li>
                                    </ul>
                                </div>
                                <div className="checkout__coupon">
                                    <span className="checkout__coupon-show" onClick={handleToggleCoupon}>Add coupon</span>
                                    {showCoupon && <div className="input-wrapper input-wrapper--full-width">
                                        <input 
                                            type="text" 
                                            className="form-input" 
                                            placeholder="Enter Coupon Code"
                                            value={couponCode}
                                            onChange={(e) => setCouponCode(e.target.value)}
                                        />
                                        <button type="button" className="btn apply-coupon-btn" onClick={handleApplyCoupon}>Apply Coupon</button>
                                        {couponError && <p className="form-message form-error form-input-error">{couponError}</p>}
                                        {couponDiscount > 0 && <p className="coupon-success">Coupon Applied: {couponDiscount}% Off</p>}
                                    </div>}
                                </div>
                                <div className="checkout__info-total">
                                    <span className="checkout__info-total-left">Total</span>
                                    <span className="checkout__info-total-right">${total}</span>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}