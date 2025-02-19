import { useEffect, useState, useContext } from 'react';
import { SERVER } from '../../utils/utils';
import './changeUsers.scss';
import { UserContext } from '../user/user-context';

export default function ChangeUsers() {
    const [showError, setShowError] = useState(false);
    const [showSuccessRemove, setSuccessRemove] = useState(false);
    const [users, setUsers] = useState([]);

    const {user} = useContext(UserContext);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await fetch(`${SERVER}users`, {
                    method: "GET",
                });

                if(!response.ok) {
                    throw new Error("Failed to fetch users!");
                }

                const data = await response.json();
                const filteredUsers = data.users.filter(u => u.id !== user.id);//Omit the current logged in user

                setUsers(filteredUsers);
                setShowError(false);
            } catch (error) {
                setShowError(true);
            }
        };

        fetchUsers();
    }, [user.id]);

    const handleRemove = async (userId) => {
        try {
            const response = await fetch(`${SERVER}users/${userId}`, {
                method: 'DELETE',
            });

            if(response.ok) {
                setUsers(users.filter(user => user.id !== userId));
                setSuccessRemove(true);
            } else {
                setSuccessRemove(false);
                throw new Error("Failed to remove user");
            }

        } catch (error) {
            setShowError(true);
            throw new Error("Error reomving user: ", error);
        }
    };

    return (
        <div className="change-users">
            {showError && <span className='form-message form-error change__error'>Enter correct username and password!</span>}
            {showSuccessRemove && <span className='form-message form-success change__success'>User removed!</span>}
            <ul className="change-users__list">
                {
                    users.map(user => (
                        <li className="change-users__list-item" key={user.id}>
                        <div className="change-users__list-item-top">
                            <div className="change-users__list-item-left">
                                <span className="change-users__list-item-name">{user.username}</span>
                            </div>
                            <div className="change-users__list-item-right">
                                <span className="change-users__list-button change-users__list-remove" onClick={() => handleRemove(user.id)}>Remove</span>
                                <span className="change-users__list-button change-users__list-change">Change</span>
                            </div>
                        </div>
                        <div className="change-users__list-item-bottom"></div>
                    </li>
                    )
                )}
            </ul>
        </div>
    )
}