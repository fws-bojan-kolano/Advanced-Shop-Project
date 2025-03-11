import { createContext, useState, useContext, useEffect } from "react";
import { useUser } from "../user/user-context";

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartContextProvider = ({ children }) => {
	const { user, updateUserCart } = useUser();
	const [cart, setCart] = useState(user?.cart || []);

	useEffect(() => {
		if (user && user.cart) {
			setCart(user.cart);
		}
	}, [user]);

  	const addToCart = (product, quantity) => {
		setCart((prevCart) => {
			const existingProductIndex = prevCart.findIndex((item) => item.id === product.id);
			let updatedCart;

			if (existingProductIndex >= 0) {
				updatedCart = [...prevCart];
				updatedCart[existingProductIndex].quantity += quantity;
			} else {
				updatedCart = [...prevCart, { ...product, quantity }];
			}

			console.log("🛒 Cart after add/update: ", updatedCart);
			updateUserCart(updatedCart); // Sync cart with user data
			return updatedCart;
		});
	};

  	const removeFromCart = (productId) => {
		setCart((prevCart) => {
			const updatedCart = prevCart.filter((item) => item.id !== productId);
			console.log("❌ Cart after removal: ", updatedCart);
			updateUserCart(updatedCart); // Sync cart with user data
			return updatedCart;
		});
  	};

  	/* const updateQuantity = (productId, newQuantity) => {
		setCart((prevCart) => {
			const updatedCart = [...prevCart];
			const productIndex = updatedCart.findIndex((item) => item.id === productId);

			if (productIndex >= 0) {
				if (newQuantity === 0) {
				// Remove item from cart if quantity is 0
				updatedCart.splice(productIndex, 1);
				} else {
				updatedCart[productIndex].quantity = newQuantity;
				}
			}

			updateUserCart(updatedCart); // Sync cart with user data
			return updatedCart;
		});
	}; */

  	const contextValue = {
		cart,
		addToCart,
		removeFromCart,
		/* updateQuantity */
	};

  	return <CartContext.Provider value={contextValue}>{children}</CartContext.Provider>;
};
