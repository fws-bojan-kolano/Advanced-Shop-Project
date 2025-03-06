import { createContext, useContext, useEffect, useState } from "react";

export const UserContext = createContext({
    user: null,
    setUser: () => {},
    updateUserCart: () => {}
});

export const useUser = () => {
    return useContext(UserContext);
}

export default function UserContextProvider({children}) {
    const [user, setUser] = useState(null);

    useEffect(() => {//Get user from local storage
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

    const updateUserCart = (updatedCart) => {
        if(user) {
            const updatedUser = {...user, cart: updatedCart};
            setUser(updatedUser);
            localStorage.setItem('user', JSON.stringify(updatedUser));
        }
    }

    const contextValue = {
        user,
        setUser,
        updateUserCart
    }

    return (
        <UserContext.Provider value={contextValue}>
            {children}
        </UserContext.Provider>
    )
}