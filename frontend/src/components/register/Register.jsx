import { useState, useRef, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { UserContext } from '../user/user-context';
import { SERVER } from "../../utils/utils";
import "./register.scss";

export default function Register() {
    const [showError, setShowError] = useState(false);
    const [showLoader, setShowLoader] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);
    const [role, setRole] = useState('admin');
    const {setUser} = useContext(UserContext);
    const navigate = useNavigate();
    const usernameRef = useRef(null);
    const passwordRef = useRef(null);
    const emailRef = useRef(null);

    const handleSubmit = async (event) => {
        event.preventDefault();
        setShowLoader(true);

        if(usernameRef?.current.value.trim() === '' || passwordRef?.current.value.trim() === '' || emailRef?.current.value.trim() == '') {
            setShowLoader(false);
            setShowError(true);
            return;
        }

        try {
            const response = await fetch(`${SERVER}users/register`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    username: usernameRef.current.value,
                    email: emailRef.current.value,
                    password: passwordRef.current.value,
                    role: role
                }),
            });

            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

            const result = await response.json();
            if (result.success) {
                setUser(result.user);
                setShowLoader(false);
                setShowSuccess(true);
                navigate('/dashboard');
            } else {
                setShowError(true);
                setShowLoader(false);
            }
        } catch (error) {
            console.error("Error during registration:", error);
            setShowError(true);
            setShowLoader(false);
        } finally {
            setShowLoader(false);
        }
    };

    return (
        <div className="login register">
            <div className="container">
                <h1 className="login__title register__title page-title">Register</h1>
                {showLoader && <span className='loader login__loader'></span>}
                <form className="register__form form" onSubmit={handleSubmit}>
                    {showError && <span className="form-message form-error register__error">Some fields are empty!</span>}
                    {showSuccess && <span className='form-message form-success my-account__success'>Account created successfully!</span>}
                    <input
                        type="text"
                        name="username"
                        placeholder="Username"
                        ref={usernameRef}
                    />
                    <input
                        type="email"
                        name="email"
                        placeholder="Email"
                        ref={emailRef}
                    />
                    <input
                        type="password"
                        name="password"
                        placeholder="Password"
                        ref={passwordRef}
                    />
                    <div className="register__radio-wrapper">
                        <p>Select the role:</p>
                        <div className="register__radio-wrapper-item">
                            <input
                                type="radio"
                                id="admin"
                                name="role"
                                value="admin"
                                checked={role === 'admin'}
                                onChange={(e) => setRole(e.target.value)}
                            />
                            <label for="admin">Admin</label>
                        </div>
                        <div className="register__radio-wrapper-item">
                            <input
                                type="radio"
                                id="user"
                                name="role"
                                value="user"
                                checked={role === 'user'}
                                onChange={(e) => setRole(e.target.value)}
                            />
                            <label for="user">User</label>
                        </div>
                    </div>
                    <input
                        className="register__form-submit"
                        type="submit"
                        value="Register"
                    />
                </form>
            </div>
        </div>
    );
}