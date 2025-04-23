import { Link, useNavigate } from 'react-router-dom';
import { UserContext } from "../user/user-context";
import { useCart } from '../cart/cart-context';
import './thankYou.scss';
import { useEffect, useContext, useState } from 'react';

export default function ThankYou() {
    const { user, setUser } = useContext(UserContext);
    const {setCart} = useCart();
    const navigate = useNavigate();
    const [orderDetails, setOrderDetails] = useState({});

    useEffect(() => {
        if(user?.order) {
            const {order} = user;
            setOrderDetails({...order});
			localStorage.removeItem('cart');
            setCart([]);
			const updatedUser = { ...user, cart: [], order: null };
			setUser(updatedUser);
        } else {
            navigate('/shop');
        }
    }, []);

    return (
        <div className="thank-you">
            <div className="container">
                <div className="thank-you__wrapper">
                    {!orderDetails?.items ? (
                        <p>Loading...</p>
                    ) : (
                        <>
                            <h1 className="page-title checkout__title thank-you__title">Thank you for your order!</h1>
                            <p className="thank-you__sub-title">Your order has been successfully placed.</p>
                            <div className="thank-you__order-review">
                                {orderDetails.items?.length === 0 ? (
                                    <p className="thank-you__order-text">No items in your order!</p>
                                ) : (
                                    <>
                                        <h2 className="thank-you__order-summary-title">Order Summary</h2>
                                        <p className="thank-you__order-text"><span>Order ID: </span>{orderDetails.orderId}</p>
                                        {orderDetails.date && <p className="thank-you__order-text"><span>Date: </span>{new Date(orderDetails.date).toLocaleString()}</p>}
                                        {orderDetails.address && <p className="thank-you__order-text"><span>Shipping Address: </span>{orderDetails.address}</p>}
                                        {orderDetails.zip && <p className="thank-you__order-text"><span>ZIP: </span>{orderDetails.zip}</p>}
                                        {orderDetails.company && <p className="thank-you__order-text"><span>Company: </span>{orderDetails.company}</p>}
                                        {orderDetails.name && <p className="thank-you__order-text"><span>Name: </span>{orderDetails.name}</p>}
                                        {orderDetails.email && <p className="thank-you__order-text"><span>Email: </span>{orderDetails.email}</p>}
                                        {orderDetails.phone && <p className="thank-you__order-text"><span>Phone: </span>{orderDetails.phone}</p>}
                                        <p className="thank-you__order-text"><span>Total: </span>${orderDetails.total}</p>
                                        <h3 className="thank-you__order-summary-title">Items Ordered</h3>
                                        <ul className="thank-you__ordered-items">
                                            {orderDetails.items?.map((item, index) => (
                                                <li className='thank-you__ordered-item' key={index}>
                                                    <Link className='thank-you__ordered-item-link' to={`/product/${item.id}`}>
                                                        <div className="thank-you__ordered-item-image-box">
                                                            <img className='thank-you__ordered-item-image' src={item.image} alt={item.name} />
                                                            <p className='thank-you__ordered-item-title'>{item.name}</p>
                                                        </div>
                                                        <div className="thank-you__ordered-item-price-box">
                                                            <p className='thank-you__ordered-item-category'>Category: {item.category}</p>
                                                            <p className='thank-you__ordered-item-quantity'><strong>Quantity: </strong>{item.quantity}</p>
                                                            <p><strong>Price: </strong>${item.price}</p>
                                                        </div>
                                                    </Link>
                                                </li>
                                            ))}
                                        </ul>
                                    </>
                                )}
                            </div>
                        </>
                    )}
                    <div className="thank-you__order-button-box">
                        <Link to="/shop" className='btn'>Back to shop</Link>
                    </div>
                </div>
            </div>
        </div>
    )
}