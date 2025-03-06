import { createContext, useState, useContext, useEffect } from "react";
import {useUser} from '../user/user-context';

const CartContext = createContext();

export const useCart = () => {
    return useContext(CartContext);
}

export const CartContextProvider = ({children}) => {
    const {user, updateUserCart} = useUser();
    const [cart, setCart] = useState([]);

    useEffect(() => {
        if(user) {
            setCart(user.cart);
        }
    }, [user]);

    const addToCart = (product, quantity) => {
        setCart(prevCart => {
            const existingProductIndex = prevCart.findIndex(item => item.id === product.id);

            if(existingProductIndex >= 0) {//update quantity if product already in the cart
                const updatedCart = [...prevCart];
                updatedCart[existingProductIndex].quantity += quantity;
            } else {
                updatedCart = [...prevCart, {...product, quantity}];//add product in cart if it already isn't
            }

            updateUserCart(updatedCart);
            return updatedCart;
        });
    };

    const removeFromCart = (productId) => {
        setCart(prevCart => {
            const updatedCart = prevCart.filter(item => item.id !== productId);
            updateUserCart(updatedCart);
            return updatedCart;
        });
    };

    const updateQuantity = (productId, newQuantity) => {
        setCart(prevCart => {
            const updatedCart = [...prevCart];
            const productIndex = updatedCart.findIndex(item => item.id === productId);

            if(productIndex >= 0) {
                updatedCart[productIndex].quantity = newQuantity;
            }

            updateUserCart(updatedCart);
            return updatedCart;
        });
    };

    const contextValue = {
        cart,
        addToCart,
        removeFromCart,
        updateQuantity
    }

    return (
        <CartContext.Provider value={contextValue} >
            {children}
        </CartContext.Provider>
    )
}