import { useContext, useState } from "react";
import { UserContext } from "../user/user-context";
import './myAccount.scss';

export default function MyAccount() {
    const [showLoader, setShowLoader] = useState(false);

    const user = useContext(UserContext);

    const username = user.username;
    const email = user.email;

    console.log(username);
    console.log(email);

    const handleSubmit = async (event) => {
        event.preventDefault();

        setShowLoader(true);
    }

    return (
        <div className="my-account">
            <form className="my-account__form" onSubmit={handleSubmit}>
                <div className="my-account__form-fields">
                    <div className="input-wrapper">
                        <input type="text" className="form-input" placeholder="Username" />
                        <span className="form-message form-input-error">Enter correct data.</span>
                    </div>
                    <div className="input-wrapper">
                        <input type="email" className="form-input" placeholder="Email" />
                    </div>
                </div>
                <input className='my-account__form-submit' type="submit" value="Update" />
                {showLoader && <span className='loader my-account__loader'></span>}
            </form>
        </div>
    )
}