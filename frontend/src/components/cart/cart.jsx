import { useCart } from "./cart-context";
import { Link } from "react-router-dom";
import PositiveNumberInput from "../common/PositiveNumberInput";
import './cart.scss';

export default function Cart() {

    const {cart, addToCart, removeFromCart} = useCart();

    const cartItems = cart.filter(item => item.quantity > 0);

    const handleIncrement = (product) => addToCart(product, product.quantity + 1);

    const handleDecrement = (product) => removeFromCart(product.id, product.quantity - 1);

    const handleChangeQuantity = (product, newQuantity) => {

        if (isNaN(newQuantity) || newQuantity === '') return;

        if (newQuantity === 0 || newQuantity === '0') {
            removeFromCart(product.id);
        } else {
            addToCart(product, newQuantity);
        }
    };

    return (
        <div className="cart">
            <div className="container">
                <h2 className="section-title cart__title">Cart</h2>
                {cartItems.length === 0 ? (
                    <p>Your cart is empty! 
                        <Link to='/shop'>Continue Shopping</Link>
                    </p>) : (
                        <ul className="cart__items">
                            {cartItems.map(item => (
                                <li className="cart__item" key={item.id}>
                                    <Link className="cart__image-title" to={`/product/${item.id}`}>
                                        <div className="cart__item-image-box">
                                            <img className="cart__item-image" src={item.image} alt={item.name} />
                                        </div>
                                        <div className="cart__item-image-title-box">
                                            <p className="cart__item-name">{item.name}</p>
                                            <p className="cart__item-price">Price: ${item.price}</p>
                                        </div>
                                    </Link>
                                    <div className="cart__details">
                                        <p className="cart__item-total-price">Subtotal ${item.price * item.quantity}</p>
                                        <div className="cart__details-input-box">
                                            <PositiveNumberInput
                                                value={item.quantity}
                                                onChange={newQuantity => (handleChangeQuantity(item, newQuantity))}
                                                onIncrement={() => handleIncrement(item)}
                                                onDecrement={() => handleDecrement(item)}/>
                                            <button className="btn cart__remove-item" onClick={() => removeFromCart(item.id)}>Remove</button>
                                        </div>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    )}
            </div>
        </div>
    )
}