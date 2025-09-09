import { useEffect, useState, useContext, type FormEvent } from 'react';
import { SERVER } from '../../utils/utils';
import './changeUsers.scss';
import { UserContext } from '../user/user-context';
import type { User } from '../../interfaces/User';
import type { UserContextType } from '../../interfaces/UserContextType';

export default function ChangeUsers() {
    const [showError, setShowError] = useState(false);
    const [showErrorChange, setShowErrorChange] = useState(false);
    const [showSuccessRemove, setSuccessRemove] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);
    const [showLoader, setShowLoader] = useState(false);
    const [users, setUsers] = useState<User[]>([]);
    const [editingUserId, setEditingUserId] = useState<String | null>(null);
    const [editedUser, setEditedUser] = useState<Partial<User> | null>(null);
    const {user} = useContext(UserContext) as UserContextType;

    useEffect(() => {
        if(!user) return;

        const fetchUsers = async () => {
            try {
                const response = await fetch(`${SERVER}users`, {method: "GET"});
                if(!response.ok) throw new Error("Failed to fetch users!");

                const data: { users: User[] } = await response.json();
                const filteredUsers = data.users.filter(u => u.id !== user.id);//Omit the current logged in user

                setUsers(filteredUsers);
                setShowError(false);
            } catch (error) {
                setShowError(true);
                console.error("Error fetching users:", error);
            }
        };

        fetchUsers();
    }, [user?.id]);

    const handleRemove = async (userId: string) => {
        setEditingUserId(null);
        setEditedUser(null);

        try {
            const response = await fetch(`${SERVER}users/${userId}`, {method: 'DELETE'});
            if(response.ok) {
                setUsers(users.filter(user => user.id !== userId));
                setSuccessRemove(true);
                setTimeout(() => {
                    setSuccessRemove(false);
                }, 1000);
            } else {
                setSuccessRemove(false);
                throw new Error("Failed to remove user");
            }

        } catch (error) {
            setShowError(true);
            throw new Error("Error removing user: " + (error instanceof Error ? error.message : String(error)));
        }
    };

    const handleDropdown = (user: User) => {
        if(editingUserId === user.id) {
            setEditingUserId(null);
            setEditedUser(null);
        } else {
            setEditingUserId(user.id);
            setEditedUser({
                username: user.username,
                email: user.email,
                role: user.role,
                password: ""
            });
        }
    };
    
    const handleInputChange = (field: keyof User, value: string) => {
        setEditedUser(prev => ({
            ...prev,
            [field]: value,
        }));
    };

    const handleUpdate = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setShowLoader(true);

        function assignIfValid<T extends object>(
            target: Partial<T>,
            key: keyof T,
            value: unknown
        ) {
            if (typeof value === "string" && value.trim() === "") return;
            if (typeof value === "string" || typeof value === "number" || typeof value === "boolean") {
            target[key] = value as T[keyof T];
            }
        }

        const payload: Partial<User> = {};
        if(editedUser) {
            (Object.entries(editedUser) as [keyof User, User[keyof User]][]).forEach(([key, value]) => assignIfValid(payload, key, value));
        }

        if(Object.keys(payload).length === 0) {
            setShowErrorChange(true);
            setShowLoader(false);
            return;
        }

        try {
            const response = await fetch(`${SERVER}users/${editingUserId}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload)
            });

            if (!response.ok) throw new Error("Failed to update user!");

            const updatedUser = {...users.find(user => user.id === editingUserId), ...payload};
            setUsers(users.map(user => user.id === editingUserId ? {...user, ...payload} : user));
            setEditedUser(updatedUser);//update input fields after succesfull change
            setShowSuccess(true);
            setShowLoader(false);
            setTimeout(() => {
                setShowSuccess(false);
                setEditingUserId(null);
                setEditedUser(null);
            }, 1000);
        } catch (error) {
            setShowErrorChange(true);
            setShowLoader(false);
        }
    };

    return (
        <div className="change-users">
            {showError && <span className='form-message form-error change__error'>Enter correct username and password!</span>}
            {showSuccessRemove && <span className='form-message form-success change__success'>User removed!</span>}
            <ul className="change-users__list">
                {
                    users.map(user => 
                    (
                        <li className="change-users__list-item" key={user.id}>
                            <div className="change-users__list-item-top">
                                <div className="change-users__list-item-left">
                                    <span className="change-users__list-item-name">{user.username}</span>
                                </div>
                                <div className="change-users__list-item-right">
                                    <span className="change-users__list-button change-users__list-remove" onClick={() => handleRemove(user.id)}>Remove</span>
                                    <span className="change-users__list-button change-users__list-change" onClick={() => handleDropdown(user)}>Change</span>
                                </div>
                            </div>
                        </li>
                    )
                )}
            </ul>
            {editingUserId !== null && editedUser && 
                <div className="change-users__list-item-bottom">
                    <form className="change-users__form" onSubmit={handleUpdate}>
                        <div className="my-account__form-fields">
                            <div className="input-wrapper">
                                <input 
                                    type="text" 
                                    className="form-input" 
                                    placeholder="Username" 
                                    value={editedUser.username} 
                                    onChange={(e) => handleInputChange("username", e.target.value)} 
                                    />
                            </div>
                            <div className="input-wrapper">
                                <input 
                                    type="email" 
                                    className="form-input" 
                                    placeholder="Email"
                                    value={editedUser.email} 
                                    onChange={(e) => handleInputChange("email", e.target.value)} 
                                    />
                            </div>
                            <div className="input-wrapper">
                                <div className="register__radio-wrapper">
                                    <p>Select the role:</p>
                                    <div className="register__radio-wrapper-item">
                                        <input 
                                            type="radio" 
                                            id="admin" 
                                            name="role" 
                                            value="admin" 
                                            checked={editedUser.role === "admin"} 
                                            onChange={(e) => handleInputChange("role", e.target.value)} 
                                            />
                                        <label htmlFor="admin">Admin</label>
                                    </div>
                                    <div className="register__radio-wrapper-item">
                                        <input 
                                            type="radio" 
                                            id="user" 
                                            name="role" 
                                            value="user" 
                                            checked={editedUser.role === "user"} 
                                            onChange={(e) => handleInputChange("role", e.target.value)} 
                                            />
                                        <label htmlFor="user">User</label>
                                    </div>
                                </div>
                            </div>
                            <div className="input-wrapper">
                                <input 
                                    type="text" 
                                    className="form-input" 
                                    placeholder="Password" 
                                    value={editedUser.password}
                                    onChange={(e) => handleInputChange("password", e.target.value)} 
                                    />
                            </div>
                        </div>
                        <input className='my-account__form-submit' type="submit" value="Update" />
                        {showLoader && <span className='loader my-account__loader'></span>}
                        {showSuccess && <span className='form-message form-success my-account__success'>Account updated successfully!</span>}
                        {showErrorChange && <span className='form-message form-error change__error'>Enter correct username and password!</span>}
                    </form>
                </div>
            }
        </div>
    )
}