
import { useParams } from 'react-router-dom';
import './singleOrder.scss';
import { useContext } from 'react';
import { UserContext } from '../user/user-context';

export default function SingleOrder() {
    const {orderId} = useParams();
    const {user} = useContext(UserContext);

    const order = user?.orders?.find(order => order.orderId === orderId);
    console.log(order);

    return (
        <div className="single-order">
            <div className="container">
                <div className="single-order__content">
                    {order ? (
                        <>
                            <h2 className="section-title">Order Details</h2>
                            <div className="single-order__details">
                                <div className="single-order__details-item">
                                    <span className="single-order__details-title">Address: </span>
                                    <span className="single-order__details-value">{order.address}</span>
                                </div>
                                <div className="single-order__details-item">
                                    <span className="single-order__details-title">Email: </span>
                                    <span className="single-order__details-value">{order.email}</span>
                                </div>
                            </div>
                        </>
                        ) : (
                            <h2 className="section-title">Order Not Found</h2>
                        )}
                </div>
            </div>
        </div>
    )
}