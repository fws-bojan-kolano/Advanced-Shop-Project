import { Link } from 'react-router-dom';
import { useCart } from '../cart/cart-context';
import { useState } from 'react';
import './product.scss';
import '../cart/listingProductsItemCart.scss';

export default function Product({product}) {
    const {addToCart, updateQuantity} = useCart();
    const [quantity, setQuantity] = useState(0);

    const truncateDescription = (text, maxLength = 60) => {
        return text.length > maxLength ? text.slice(0, maxLength) + "..." : text;
    };

    const handleIncrement = () => {
        setQuantity(prevQuantity => prevQuantity + 1);
    }

    const handleDecrement = () => {
        setQuantity(prevQuantity => prevQuantity - 1);
    }

    const handleAddToCart = () => {
        if(quantity > 0) {
            addToCart(product, quantity)
        }
    }

    const handleChangeQuantity = (e) => {
        const value = Math.max(0, parseInt(e.target.value) || 0);
        setQuantity(value);
        updateQuantity(product.id, value);
    }

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
                        <div className="add-to-cart">
                            <span className="add-to-cart__inc-dec add-to-cart__dec" onClick={handleDecrement}>-</span>
                            <input type="number" className="add-to-cart__input" value={quantity} onChange={handleChangeQuantity} />
                            <span className="add-to-cart__inc-dec add-to-cart__inc" onClick={handleIncrement}>+</span>
                        </div>
                    </figcaption>
                </figure>
            </div>
        </div>
    )
}