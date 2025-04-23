import { createContext, useContext, useEffect, useState } from "react";

export const UserContext = createContext({
	user: null,
	setUser: () => {},
	updateUserCart: () => {},
});

export const useUser = () => useContext(UserContext);

export default function UserContextProvider({ children }) {
	const [user, setUser] = useState(() => {
		const storedUser = localStorage.getItem('user');
		return storedUser ? JSON.parse(storedUser) : null;
	});

	useEffect(() => {
		const storedUser = JSON.parse(localStorage.getItem("user"));
		if (storedUser) {
			setUser(storedUser);
		}
	}, []);

  	useEffect(() => {
		if (user) {
			localStorage.setItem("user", JSON.stringify(user));
		} else {
			localStorage.removeItem("user");
		}
	}, [user]);

	const updateUserCart = (updatedCart) => {
		if(user) {
			const updatedUser = { ...user, cart: updatedCart };
			setUser(updatedUser); // Only update if the cart has changed
			localStorage.setItem('user', JSON.stringify(updatedUser));
			console.log("✅ Updated User Cart: ", updatedUser.cart); // SEE the updated cart here
		}
	};

  	const contextValue = {
		user,
		setUser,
		updateUserCart
	};

  return <UserContext.Provider value={contextValue}>{children}</UserContext.Provider>;
}
