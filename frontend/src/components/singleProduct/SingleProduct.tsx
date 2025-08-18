import './singleProduct.scss';
import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { SERVER } from '../../utils/utils';
import PositiveNumberInput from '../common/PositiveNumberInput';
import { useCart } from '../cart/cart-context';

export default function SingleProduct() {
    const {id} = useParams();
    const [product, setProduct] = useState(null);
    const { cart, addToCart, removeFromCart } = useCart();
    const [newQuantity, setNeqQuantity] = useState(0);

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
        if(product) {
            const cartItem = cart?.find(item => item.id === product.id);
            const quantity = cartItem ? cartItem.quantity : 0;
            setNeqQuantity(quantity);
        }
    }, [product, cart]);

    const handleIncrement = () => addToCart(product, newQuantity + 1);

    const handleDecrement = () => removeFromCart(product.id, newQuantity - 1);

    const handleChangeQuantity = (newQuantity) => {

        if (isNaN(newQuantity) || newQuantity === '') return;

        if (newQuantity === 0 || newQuantity === '0') {
            removeFromCart(product.id);
        } else {
            addToCart(product, newQuantity);
        }
    };

    if(!product) {
        return <div className='single-product__loading'>Loading...</div>
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
                        <p className="single-product__category">Category: {product.category}</p>
                        <img src={product.image} alt={product.name} />
                    </div>
                    <div className="single-product__wrapper-right">
                        <p className="single-product__creator">By {product.creator}</p>
                        <p className="single-product__description">{product.description}</p>
                        <p className="single-product__price">Price: ${product.price}</p>
                        <PositiveNumberInput
                            value={newQuantity}
                            onChange={handleChangeQuantity}
                            onIncrement={handleIncrement}
                            onDecrement={handleDecrement}/>
                        <Link className='btn single-product__go-to-cart' to='/cart'>Go to cart</Link>
                    </div>
                </div>
            </div>
        </div>
    )
}