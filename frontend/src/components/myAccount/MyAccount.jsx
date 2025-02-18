import { useContext, useState } from "react";
import { UserContext } from "../user/user-context";
import './myAccount.scss';
import { SERVER } from "../../utils/utils";

export default function MyAccount() {
    const [showLoader, setShowLoader] = useState(false);
    const [showErrorUsername, setShowErrorUsername] = useState(false);
    const [showErrorEmail, setShowErrorEmail] = useState(false);

    const { user, setUser } = useContext(UserContext);

    const [username, setUsername] = useState(user ? user.username : '');
    const [email, setEmail] = useState(user ? user.email : '');

    const handleSubmit = async (event) => {
        event.preventDefault();

        setShowLoader(true);

        if(!username.trim()) {
            setShowErrorUsername(true);
            setShowLoader(false);
            return;
        }

        if(!email.trim()) {
            setShowErrorEmail(true);
            setShowLoader(false);
            return;
        }

        const updatedData = {};
        if(username !== user.username) updatedData.username = username;
        if(email !== user.email) updatedData.email = email;
        updatedData.id = user.id;

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
                    username: username,
                    email: email
                }));
                setShowLoader(false);
                setShowErrorUsername(false);
                setShowErrorEmail(false);
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
                        {showErrorUsername && <span className="form-message form-error form-input-error">Enter correct data.</span>}
                    </div>
                    <div className="input-wrapper">
                        <input type="email" className="form-input" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
                        {showErrorEmail && <span className="form-message form-error form-input-error">Enter correct data.</span>}
                    </div>
                </div>
                <input className='my-account__form-submit' type="submit" value="Update" />
                {showLoader && <span className='loader my-account__loader'></span>}
            </form>
        </div>
    )
}