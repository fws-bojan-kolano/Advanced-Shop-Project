import { Link } from 'react-router-dom';
import { useCart } from '../cart/cart-context';
import { useState, useEffect } from 'react';
import './product.scss';
import '../cart/listingProductsItemCart.scss';
import PositiveNumberInput from '../common/PositiveNumberInput';

export default function Product({product}) {
    const { addToCart, removeFromCart, updateQuantity } = useCart();
    const [quantity, setQuantity] = useState(0);

    const truncateDescription = (text, maxLength = 60) => {
        return text.length > maxLength ? text.slice(0, maxLength) + "..." : text;
    };

    const handleIncrement = () => {
        setQuantity(prevQuantity => {
            const newQuantity = prevQuantity + 1;
            updateQuantity(product.id, newQuantity);
            return newQuantity;
        });
    };

    const handleDecrement = () => {
        setQuantity(prevQuantity => {
            const newQuantity = Math.max(0, prevQuantity - 1);
            updateQuantity(product.id, newQuantity);
            return newQuantity;
        });
    };

    const handleAddToCart = () => {
        if(quantity > 0) {
            addToCart(product, quantity)
        }
    }

    const handleChangeQuantity = (newQuantity) => {
        setQuantity(newQuantity);
        updateQuantityInCart(product.id, newQuantity);
    };

    const updateQuantityInCart = (newQuantity) => {
        if (newQuantity === 0) {
          removeFromCart(product.id); // Remove item if quantity becomes 0
        } else {
          updateQuantity(product.id, newQuantity); // Update quantity in cart
        }
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
                            <Link className="book__btn" to={`/product/${product.id}`} >See More</Link>
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
                        <PositiveNumberInput value={quantity} onChange={handleChangeQuantity} onIncrement={handleIncrement} onDecrement={handleDecrement} />
                    </figcaption>
                </figure>
            </div>
        </div>
    )
}