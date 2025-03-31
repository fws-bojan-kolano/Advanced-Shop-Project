import { useCallback, useState } from 'react';
import { useCart } from '../cart/cart-context';
import { Link } from "react-router-dom";
import './checkout.scss';

export default function Checkout() {
    const [address, setAddress] = useState('');
    const [zip, setZip] = useState('');
    const [shippingCost, setShippingCost] = useState(0);
    const [suggestions, setSuggestions] = useState([]);
    const [error, setError] = useState(null);
    const [showLoaderAddress, setShowLoaderAddress] = useState(false);
    const [couponCode, setCouponCode] = useState('');
    const [couponDiscount, setCouponDiscount] = useState(0);
    const [couponError, setCouponError] = useState('');
    const [showCoupon, setShowCoupon] = useState(false);

    const {cart} = useCart();
    const cartItems = cart.filter(item => item.quantity > 0);

    const validCoupons = {
        'DISCOUNT10': 10, // 10% discount
        'SAVE20': 20 // 20% discount
    }

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

    const debounce = (func, delay) => {
        let timer;
        return (...args) => {
            clearTimeout(timer);
            timer = setTimeout(() => func(...args), delay);
        }
    }

    const fetchAddressSuggestions = async (query) => {
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

            if(!response.ok) {
                throw new Error("Failed to fetch!");
            }
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

    const handleSelectAddress = (place) => {
        setAddress(place.display_name);
        setSuggestions([]);

        if(place.address && place.address.postcode) {
            setZip(place.address.postcode || '');
        }

        if(place.address && place.address.country) {
            calculateShipping(place.address.country);
        }
    }

    const fetchNeighboringCountries = async (selectedCountry) => {
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

    const calculateShipping = async (selectedCountry) => {
        if(!selectedCountry) return;

        let cost = 25; //Default international shipping cost
        if(selectedCountry === 'Serbia') {
            cost = 5; //Same country shipping
        } else {
            const neighbors = await fetchNeighboringCountries(selectedCountry);

            if(neighbors.includes('SRB')) {
                cost = 15; // Shipping costs 15$ if Serbian neighbor
            }
        }

        setShippingCost(cost);
    }

    const subtotal = cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);

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
                            <form className="checkout__form">
                                <div className="checkout__form-fields">
                                    <div className="input-wrapper">
                                        <input type="text" className="form-input" placeholder="First and Last name" />
                                        <span className="form-message form-error form-input-error">Enter correct first and last name.</span>
                                    </div>
                                    <div className="input-wrapper">
                                        <input type="email" className="form-input" placeholder="Email" />
                                        <span className="form-message form-error form-input-error">Enter correct email.</span>
                                    </div>
                                    <div className="input-wrapper">
                                        <input type="text" className="form-input" placeholder="Phone" />
                                        <span className="form-message form-error form-input-error">Enter correct phone.</span>
                                    </div>
                                    <div className="input-wrapper">
                                        <input
                                            type="text"
                                            className="form-input"
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
                                                        onClick={() => handleSelectAddress(place)}>{place.display_name}</li>
                                                ))}
                                            </ul>
                                        )}
                                        <span className="form-message form-error form-input-error">Enter correct address.</span>
                                    </div>
                                    <div className="input-wrapper">
                                        <input
                                            type="text"
                                            className="form-input"
                                            placeholder="ZIP"
                                            value={zip}
                                            onChange={(e) => setZip(e.target.value)}
                                            />
                                        <span className="form-message form-error form-input-error">Enter correct ZIP.</span>
                                    </div>
                                    <div className="input-wrapper">
                                        <input type="text" className="form-input" placeholder="Company name" />
                                        <span className="form-message form-error form-input-error">Enter correct company name.</span>
                                    </div>
                                </div>
                            </form>
                            <div className="checkout__info">
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
                                        <button 
                                            type="button" 
                                            className="btn apply-coupon-btn"
                                            onClick={handleApplyCoupon}
                                        >
                                            Apply Coupon
                                        </button>
                                        {couponError && <p className="form-message form-error form-input-error">{couponError}</p>}
                                        {couponDiscount > 0 && <p className="coupon-success">Coupon Applied: {couponDiscount}% Off</p>}
                                    </div>}
                                </div>
                                <div className="checkout__info-total">
                                    <span className="checkout__info-total-left">Total</span>
                                    <span className="checkout__info-total-right">
                                        ${couponDiscount > 0 ? 
                                            (subtotal + shippingCost) - ((subtotal + shippingCost) * (couponDiscount / 100)) 
                                            : (subtotal + shippingCost)
                                    }</span>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}