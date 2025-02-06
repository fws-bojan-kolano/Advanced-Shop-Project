import { createContext, useEffect, useState } from "react";

export const UserContext = createContext({
    user: null,
    setUser: () => {}
});

export default function UserContextProvider({children}) {
    const [user, setUser] = useState(null);

    useEffect(() => {//Store user to local storage
        const storedUser = JSON.parse(localStorage.getItem('user'));
        if(storedUser) {
            setUser(storedUser);
        }
    }, []);

    useEffect(() => {//When user changes, save it to local storage
        if(user) {
            localStorage.setItem('user', JSON.stringify(user));
        } else {
            localStorage.removeItem('user');
        }
    }, [user]);

    const contextValue = {
        user,
        setUser,
    }

    return (
        <UserContext.Provider value={contextValue}>
            {children}
        </UserContext.Provider>
    )
}