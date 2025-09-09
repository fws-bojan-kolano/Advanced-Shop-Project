import { createContext, useState, useContext, useEffect } from "react";
import { useUser } from "../user/user-context";
import { SERVER } from "../../utils/utils";
import type { CartContextType } from "../../interfaces/CartContextType";
import type { CartItem } from "../../interfaces/CartItem";

export const CartContext = createContext<CartContextType | undefined>(undefined);

export const useCart = (): CartContextType => {
    const context = useContext(CartContext);
    if (!context) {
        throw new Error("useCart must be used within a CartContextProvider");
    }
    return context;
};

interface CartContextProviderProps {
	children: React.ReactNode;
}

export const CartContextProvider = ({ children }: CartContextProviderProps) => {
	const { user, updateUserCart } = useUser();
	const [cart, setCart] = useState<CartItem[]>(user?.cart || []);

	useEffect(() => {
		if (user?.cart) {
			setCart(user?.cart);
		} else {
			const storedCart = localStorage.getItem('cart');
			if(storedCart) {
				try {
					const parsed: CartItem[] = JSON.parse(storedCart);
					setCart(parsed);
				} catch (error) {
    				console.error("Failed to parse cart from localStorage");
				}
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

	const updateCartOnServer = async (cart: CartItem[]) => {
		if(user) {
			try {
				const response = await fetch(`${SERVER}users/cart`, {
					method: 'POST',
					headers: {
						'Content-Type': 'application/json'
					},
					body: JSON.stringify({
						id: user.id,
						cart: cart
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

  	const addToCart = (product: CartItem, newQuantity: number) => {
		const value = +newQuantity;
		setCart((prevCart) => {
			const existingProduct = prevCart.find(item => item.id === product.id);
			let updatedCart: CartItem[];

			if (existingProduct) {
				updatedCart = prevCart.map(item => item.id === product.id ? {
					...item, quantity: value
				} : item);
			} else {
				updatedCart = [...prevCart, { ...product, quantity: value }];
			}

			updateUserCart(updatedCart); // Sync cart with user data
			updateCartOnServer(updatedCart);
			return updatedCart;
		});
	};

  	const removeFromCart = (productId: string | number, newQuantity? :number | null) => {
		setCart((prevCart) => {
			let updatedCart: CartItem[];
			if(newQuantity === 0 || newQuantity === null || newQuantity === undefined) {
				updatedCart = prevCart.filter(item => item.id !== productId);
			} else {
				updatedCart = prevCart.map((item) => {
					if (item.id === productId) {
						if(item.quantity > 1) {
							return {...item, quantity: item.quantity - 1};
						}
						return null;
					}
					return item;
				}).filter(item => item !== null);
			}

			updateUserCart(updatedCart); 
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
