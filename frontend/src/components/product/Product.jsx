import { Link } from 'react-router-dom';
import { useCart } from '../cart/cart-context';
import { useEffect, useState } from 'react';
import './product.scss';
import '../cart/listingProductsItemCart.scss';
import PositiveNumberInput from '../common/PositiveNumberInput';

export default function Product({ product }) {
    const { cart, addToCart, removeFromCart } = useCart();
    /* const [quantity, setQuantity] = useState(0); */

    const cartItem = cart.find(item => item.id === product.id);
    const quantity = cartItem ? cartItem.quantity : 0;

    /* useEffect(() => {
        const cartItem = cart.find(item => item.id === product.id);
        if (cartItem) {
            setQuantity(cartItem.quantity);  // Initialize quantity from cart
        }
    }, [product.id]); */

    /* const handleIncrement = () => {
        const newQuantity = quantity + 1;
        setQuantity(newQuantity);
        addToCart(product, newQuantity);
    }; */
    const handleIncrement = () => addToCart(product, quantity + 1);

    const handleDecrement = () => {
        const newQuantity = Math.max(0, quantity - 1); // Ensure no negative values
        /* setQuantity(newQuantity); */
        if (newQuantity === 0) {
            removeFromCart(product.id);
        } else {
            addToCart(product, newQuantity);
        }
    };

    const handleChangeQuantity = (newQuantity) => {
        console.log("Quantity changed:", newQuantity);  // This log should be printed
        /* setQuantity(newQuantity); */
        const num = parseInt(newQuantity, 10) || 0;
        if (num === 0) {
            removeFromCart(product.id);
        } else {
            addToCart(product, num);
        }
    };

    const truncateDescription = (text, maxLength = 60) => {
        return text.length > maxLength ? text.slice(0, maxLength) + "..." : text;
    };

    return (
        <div className="col-xl-6 col-lg-6 col-md-12 product">
            <div className="product__wrapper">
                <figure className="book">
                    <ul className="hardcover-front">
                        <li>
                            <img src={product.image} alt={product.name} width="100%" height="100%" />
                        </li>
                        <li></li>
                    </ul>
                    <ul className="page">
                        <li></li>
                        <li>
                            <Link className="book__btn" to={`/product/${product.id}`}>See More</Link>
                        </li>
                        <li></li>
                        <li></li>
                        <li></li>
                    </ul>
                    <ul className="hardcover-back">
                        <li></li>
                        <li></li>
                    </ul>
                    <ul className="book-spine">
                        <li></li>
                        <li></li>
                    </ul>
                    <figcaption className="figcaption">
                        <h2 className="figcaption__title">{product.name}</h2>
                        <span className="figcaption__sub-title">By {product.creator}</span>
                        <p className="figcaption__text">{truncateDescription(product.description)}</p>
                        <span className="figcaption__price">Price: ${product.price}</span>
                        {/* Pass quantity as value prop */}
                        <PositiveNumberInput
                            value={quantity}
                            onChange={handleChangeQuantity}  // Ensure this is passed correctly
                            onIncrement={handleIncrement}
                            onDecrement={handleDecrement}
                        />
                    </figcaption>
                </figure>
            </div>
        </div>
    );
}
