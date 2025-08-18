import { createContext, useContext, useEffect, useState } from "react";
import type { UserContextType } from "../../interfaces/UserContextType";
import type { User } from "../../interfaces/User";
import type { UserContextProviderProps } from "../../interfaces/UserContextProviderProps";

export const UserContext = createContext<UserContextType | undefined>(undefined);

export const useUser = () => {
	const context = useContext(UserContext);
	if (!context) {
		throw new Error("useUser must be used within a UserContextProvider");
	}
	return context;
};

export default function UserContextProvider({ children }: UserContextProviderProps) {
	const [user, setUser] = useState<User | null>(() => {
		const storedUser = localStorage.getItem("user");
		return storedUser ? (JSON.parse(storedUser) as User) : null;
	});

	const [productsMegamenu, setProductsMegamenu] = useState<any[]>([]);

	useEffect(() => {
		const storedUser = localStorage.getItem("user");
		if (storedUser) {
			setUser(JSON.parse(storedUser) as User);
		}
	}, []);

  	useEffect(() => {
		if (user) {
			localStorage.setItem("user", JSON.stringify(user));
		} else {
			localStorage.removeItem("user");
		}
	}, [user]);

	const updateUserCart = (updatedCart: User["cart"]) => {
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
		updateUserCart,
		productsMegamenu,
		setProductsMegamenu
	};

  return <UserContext.Provider value={contextValue}>{children}</UserContext.Provider>;
}
