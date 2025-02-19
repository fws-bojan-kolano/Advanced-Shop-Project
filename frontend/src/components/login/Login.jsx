import { useRef, useState, useContext } from 'react';
import { UserContext } from '../user/user-context';
import { SERVER } from '../../utils/utils';
import './login.scss';

export default function Login() {
    const [showError, setShowError] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);
    const [showLoader, setShowLoader] = useState(false);

    const {setUser} = useContext(UserContext);

    const usernameRef = useRef(null);
    const passwordRef = useRef(null);

    const handleSubmit = async (event) => {
        event.preventDefault();

        const inputUsernameValue = usernameRef.current.value;
        const inputPasswordValue = passwordRef.current.value;

        setShowLoader(true);

        try {
            const response = await fetch(`${SERVER}users`, {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({
                    username: inputUsernameValue,
                    password: inputPasswordValue
                })
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const result = await response.json();
            if(result.success) {
                setUser(result.user);//Store the logged in user in the context and localstorage
                setShowError(false);
                setShowSuccess(true);
                usernameRef.current.value = '';
                passwordRef.current.value = '';
                setShowLoader(false);
            } else {
                setShowError(true);
                setShowLoader(false);
            }
        } catch (error) {
            console.error('Error during login:', error);
            setShowError(true);
            setShowLoader(false);
        }
    }
    
    return (
        <div className="login">
            <div className="container">
                <h1 className="login__title page-title">Login</h1>
                {showLoader && <span className='loader login__loader'></span>}
                <form className="login__form form" onSubmit={handleSubmit}>
                    {showError && <span className='form-message form-error login__error'>Enter correct username and password!</span>}
                    {showSuccess && <span className='form-message form-success login__success'>Login successful!</span>}
                    <input type="text" placeholder="Username" ref={usernameRef} />
                    <input type="text" placeholder="Password" ref={passwordRef} />
                    <input className='login__form-submit' type="submit" value="Login" />
                </form>
                <a className='btn btn--reverse login__form-button' href="#">Register</a>
            </div>
        </div>
    )
}