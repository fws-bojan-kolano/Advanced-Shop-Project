import { useCallback, useState } from 'react';
import './checkout.scss';

export default function Checkout() {
    const [address, setAddress] = useState('');
    const [zip, setZip] = useState('');
    const [suggestions, setSuggestions] = useState([]);
    const [error, setError] = useState(null);
    const [showLoaderAddress, setShowLoaderAddress] = useState(false);

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
            const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&addressdetails=1&q=${encodeURIComponent(query)}`);

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
            setZip(place.address.postcode);
        } else {
            setZip('');
        }
    }

    return (
        <div className="checkout">
            <div className="container">
                <h1 className="page-title checkout__title">Checkout</h1>
                <div className="checkout__wrapper">
                    <form className="checkout__form">
                        <div className="checkout__form-fields">
                            <div className="input-wrapper">
                                <input type="text" className="form-input" placeholder="Name" />
                                <span className="form-message form-error form-input-error">Enter correct username.</span>
                            </div>
                            <div className="input-wrapper">
                                <input type="email" className="form-input" placeholder="Email" />
                                <span className="form-message form-error form-input-error">Enter correct email.</span>
                            </div>
                            <div className="input-wrapper">
                                <input type="text" className="form-input" placeholder="Phone" />
                                <span className="form-message form-error form-input-error">Enter old or new matching password.</span>
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
                                <span className="form-message form-error form-input-error">Enter old or new matching password.</span>
                            </div>
                            <div className="input-wrapper">
                                <input
                                    type="text"
                                    className="form-input"
                                    placeholder="ZIP"
                                    value={zip}
                                    onChange={(e) => setZip(e.target.value)}
                                    />
                                <span className="form-message form-error form-input-error">Enter old or new matching password.</span>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}