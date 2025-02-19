import { useContext, useState, useRef } from "react";
import { UserContext } from "../user/user-context";
import './myAccount.scss';
import { SERVER } from "../../utils/utils";

export default function MyAccount() {
    const [showLoader, setShowLoader] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);
    const [showErrorUsername, setShowErrorUsername] = useState(false);
    const [showErrorEmail, setShowErrorEmail] = useState(false);
    const [showErrorPassword, setShowErrorPassword] = useState(false);
    const { user, setUser } = useContext(UserContext);

    const [username, setUsername] = useState(user ? user.username : '');
    const [email, setEmail] = useState(user ? user.email : '');

    const passwordRef = useRef(null);
    const passwordRepeatRef = useRef(null);

    const handleSubmit = async (event) => {
        event.preventDefault();

        setShowLoader(true);
        setShowSuccess(false);

        if(!username.trim()) {
            setShowErrorUsername(true);
            setShowLoader(false);
            return;
        } else {
            setShowErrorUsername(false);
            setShowLoader(false);
        }

        if(!email.trim()) {
            setShowErrorEmail(true);
            setShowLoader(false);
            return;
        } else {
            setShowErrorEmail(false);
            setShowLoader(false);
        }

        const passwordValue = passwordRef.current.value;
        const passwordRepeatValue = passwordRepeatRef.current.value;

        let updatedData = {id: user.id};
        if(username !== user.username) updatedData.username = username;
        if(email !== user.email) updatedData.email = email;

        if(!passwordValue.trim()) {
            setShowErrorPassword(true);
            setShowLoader(false);
            return;
        } else {
            setShowErrorPassword(false);
            setShowLoader(false);
        }

        if (passwordValue.trim() || passwordRepeatValue.trim()) {
            if (!passwordValue.trim() || !passwordRepeatValue.trim()) {
                setShowErrorPassword(true);
                setShowLoader(false);
                return;
            }
    
            if (passwordValue !== passwordRepeatValue) {
                setShowErrorPassword(true);
                setShowLoader(false);
                return;
            }
    
            setShowErrorPassword(false);
            updatedData.password = passwordValue;
        } else {
            setShowErrorPassword(false);
        }

        try {
            const response = await fetch(`${SERVER}users`, {
                method: "PUT",
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify(updatedData)
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const result = await response.json();
            if(result.success) {
                setUser(prevUser => ({
                    ...prevUser,
                    username: result.user.username,
                    email: result.user.email,
                    password: result.user.password
                }));
                passwordRef.current.value = '';
                passwordRepeatRef.current.value = '';
                setShowLoader(false);
                setShowErrorUsername(false);
                setShowErrorEmail(false);
                setShowSuccess(true);
            } else {
                setShowLoader(false);
            }

        } catch (error) {
            console.error('Error during data update:', error);
            setShowLoader(false);
        }
    }

    return (
        <div className="my-account">
            <form className="my-account__form" onSubmit={handleSubmit}>
                <div className="my-account__form-fields">
                    <div className="input-wrapper">
                        <input type="text" className="form-input" placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} />
                        {showErrorUsername && <span className="form-message form-error form-input-error">Enter correct username.</span>}
                    </div>
                    <div className="input-wrapper">
                        <input type="email" className="form-input" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
                        {showErrorEmail && <span className="form-message form-error form-input-error">Enter correct email.</span>}
                    </div>
                    <div className="input-wrapper">
                        <input type="text" className="form-input" placeholder="Password" ref={passwordRef} />
                        {showErrorPassword && <span className="form-message form-error form-input-error">Enter old or new matching password.</span>}
                    </div>
                    <div className="input-wrapper">
                        <input type="text" className="form-input" placeholder="Repeat Password" ref={passwordRepeatRef} />
                    </div>
                </div>
                <input className='my-account__form-submit' type="submit" value="Update" />
                {showLoader && <span className='loader my-account__loader'></span>}
                {showSuccess && <span className='form-message form-success my-account__success'>Account updated successfully!</span>}
            </form>
        </div>
    )
}