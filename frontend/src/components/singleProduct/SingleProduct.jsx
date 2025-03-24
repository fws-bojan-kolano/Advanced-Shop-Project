import './singleProduct.scss';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { SERVER } from '../../utils/utils';
import PositiveNumberInput from '../common/PositiveNumberInput';
import { useCart } from '../cart/cart-context';

export default function SingleProduct() {
    const {id} = useParams();
    const [product, setProduct] = useState(null);
    const { cart, addToCart, removeFromCart } = useCart();
    const [quantity, setQuantity] = useState(0); // state to track quantity for this product

    useEffect(() => {
        window.scrollTo(0, 0);

        const fetchProduct = async () => {
            const response = await fetch(`${SERVER}products/${id}`);
            if(!response.ok) {
                console.error('Product not found!');
                return;
            }

            const data = await response.json();
            setProduct(data);
        }

        fetchProduct();
    }, [id]);

    useEffect(() => {
        if (product) {
            // Find the product in the cart to get its quantity, use default 0 if not found
            const cartItem = cart.find(item => item.id === parseInt(id));
            setQuantity(cartItem ? cartItem.quantity : 0);
        }
    }, [cart, id, product]);

    const handleIncrement = () => addToCart(product, quantity + 1);

    const handleDecrement = () => removeFromCart(product.id, quantity - 1);

    const handleChangeQuantity = (newQuantity) => {

        if (isNaN(newQuantity) || newQuantity === '') return;

        if (newQuantity === 0 || newQuantity === '0') {
            removeFromCart(product.id);
        } else {
            addToCart(product, newQuantity);
        }
    };

    if(!product) {
        return <div>Loading...</div>
    }

    return (
        <div className="single-product">
            <div className="container">
                <div className="single-product__breadcrumbs">
                    <span>
                        <a href="/">Homepage</a> / <a href="/shop">Shop</a> / {product.name}
                    </span>
                </div>
                <div className="single-product__wrapper">
                    <div className="single-product__wrapper-left">
                        <h2 className="section-title single-product__title">{product.name}</h2>
                        <img src={product.image} alt={product.name} />
                    </div>
                    <div className="single-product__wrapper-right">
                        <p className="single-product__creator">By {product.creator}</p>
                        <p className="single-product__description">{product.description}</p>
                        <p className="single-product__price">Price: ${product.price}</p>
                        <PositiveNumberInput
                            value={quantity}
                            onChange={handleChangeQuantity}
                            onIncrement={handleIncrement}
                            onDecrement={handleDecrement}/>
                    </div>
                </div>
            </div>
        </div>
    )
}