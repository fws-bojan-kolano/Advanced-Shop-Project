import { useRef, useState } from 'react';
import { SERVER } from '../../utils/utils';
import './login.scss';

export default function Login() {
    const [showError, setShowError] = useState(false);

    const usernameRef = useRef(null);
    const passwordRef = useRef(null);

    const handleSubmit = async (event) => {
        event.preventDefault();

        const inputUsernameValue = usernameRef.current.value;
        const inputPasswordValue = passwordRef.current.value;

        try {
            const response = await fetch(`${SERVER}login`, {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({inputUsernameValue, inputPasswordValue})
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const result = await response.json();
            if(result.success) {
                setShowError(false);
            } else {
                setShowError(true);
            }
        } catch (error) {
            console.error('Error during login:', error);
            setShowError(true);
        }
    }
    
    return (
        <div className="login">
            <div className="container">
                <h1 className="login__title page-title">Login</h1>
                <form className="login__form form" onSubmit={handleSubmit}>
                    {showError && <span className='form-error login__error'>Enter correct username and password!</span>}
                    <input type="text" placeholder="Username" ref={usernameRef} />
                    <input type="text" placeholder="Password" ref={passwordRef} />{/* Change type to password later */}
                    <input className='login__form-submit' type="submit" value="Login" />
                </form>
                <a className='btn btn--reverse login__form-button' href="#">Sign Up</a>
            </div>
        </div>
    )
}