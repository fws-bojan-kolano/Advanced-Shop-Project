import { createContext, useState, useContext, useEffect } from "react";
import { useUser } from "../user/user-context";
import { SERVER } from "../../utils/utils";

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartContextProvider = ({ children }) => {
	const { user, updateUserCart } = useUser();
	const [cart, setCart] = useState(user?.cart || []);

	useEffect(() => {
		if (user?.cart) {
			setCart(user.cart);
		} else {
			const storedCart = JSON.parse(localStorage.getItem('cart'));
			if(storedCart) {
				setCart(storedCart);//Load cart from localstorage if no cart is in user data
			}
		}
	}, [user]);

	useEffect(() => {
		if(cart.length > 0) {
			localStorage.setItem('cart', JSON.stringify(cart));
		} else {
			localStorage.removeItem('cart');
		}
	});

	const updateCartOnServer = async (cart) => {
		if(user) {
			try {
				const response = await fetch(`${SERVER}users/cart`, {
					method: 'POST',
					headers: {
						'Content-Type': 'application/json'
					},
					body: JSON.stringify({
						id: user.id,
						cart
					})
				})

				const result = await response.json();
				if (result.success) {
                    console.log("Cart successfully updated on the server.");
                } else {
                    console.error("Failed to update cart on the server:", result.message);
                }
			} catch (error) {
                console.error("Error updating cart on server:", error);
			}
		}
	};

  	const addToCart = (product) => {
		setCart((prevCart) => {
			const existingProductIndex = prevCart.findIndex((item) => item.id === product.id);
			let updatedCart;

			if (existingProductIndex >= 0) {
				updatedCart = [...prevCart];
				updatedCart[existingProductIndex].quantity += 1;
			} else {
				updatedCart = [...prevCart, { ...product, quantity: 1 }];
			}

			console.log("🛒 Cart after add/update: ", updatedCart);
			updateUserCart(updatedCart); // Sync cart with user data
			updateCartOnServer(updatedCart);
			return updatedCart;
		});
	};

  	const removeFromCart = (productId) => {
		setCart((prevCart) => {
			const updatedCart = prevCart.map((item) => {
				if (item.id === productId && item.quantity > 1) {
					// Decrement the quantity by 1
					return {
						...item,
						quantity: item.quantity - 1
					};
				} else if(item.id === productId && item.quantity === 1) {
					return null;
				}
				return item;
			}).filter(item => item !== null);  // Remove items with 0 quantity

			console.log("❌ Cart after removal: ", updatedCart);
			updateUserCart(updatedCart); // Sync cart with user data
			updateCartOnServer(updatedCart);
			return updatedCart;
		});
  	};

  	const contextValue = {
		cart,
		addToCart,
		removeFromCart,
		setCart
	};

  	return <CartContext.Provider value={contextValue}>{children}</CartContext.Provider>;
};
