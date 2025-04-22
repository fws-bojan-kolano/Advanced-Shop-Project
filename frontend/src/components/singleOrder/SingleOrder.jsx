
import { Link, useParams } from 'react-router-dom';
import './singleOrder.scss';
import { useContext } from 'react';
import { UserContext } from '../user/user-context';

export default function SingleOrder() {
    const {orderId} = useParams();
    const {user} = useContext(UserContext);

    const order = user?.orders?.find(order => order.orderId === orderId);

    return (
        <div className="single-order">
            <div className="container">
                <div className="single-order__content">
                    {order ? (
                        <>
                            <Link to='/dashboard' state={{section: 'orders'}} className='single-order__link-back'>← Back to orders</Link>
                            <h2 className="section-title single-order__title">Order Details</h2>
                            <div className="single-order__details">
                                {Object.entries(order).map(([key, value]) => {
                                    if(!value || key === 'orderId') return null;

                                    return (
                                        <div className="single-order__details-item" key={key}>
                                            <span className="single-order__details-title">{key.replace(/^./, str => str.toUpperCase())}: </span>
                                            <span className="single-order__details-value">
                                                {Array.isArray(value) ? (
                                                    <ul className="single-odrer__value-list">
                                                        {value.map((item, index) => (
                                                            <li className="single-order__item" key={index}>
                                                                {typeof item === 'object' ? (
                                                                    <ul className='single-order__item-items'>
                                                                        {Object.entries(item).map(([itemKey, itemValue]) => {
                                                                            return (
                                                                                <li
                                                                                className={`single-order__item-list ${itemKey === 'id' ? 'single-order__item-id' : ''}`}
                                                                                key={itemKey}>
                                                                                    <strong>{itemKey.replace(/^./, str => str.toUpperCase())}: </strong>
                                                                                    {itemKey.toLocaleLowerCase().includes('image') ? (
                                                                                        <Link to={`/product/${item.id}`}>
                                                                                            <img src={itemValue} alt={itemKey} className='single-order__item-image' />
                                                                                        </Link>
                                                                                    ) : itemKey.toLowerCase() === 'price' ? (
                                                                                        `$${itemValue}`
                                                                                    ) : String(itemValue)}
                                                                                </li>
                                                                            )
                                                                        })}
                                                                    </ul>
                                                                ) : String(item)}
                                                            </li>
                                                        ))}
                                                    </ul>
                                                ) : typeof value == 'object' ? (
                                                    <ul>
                                                        {Object.entries(value).map(([objKey, objVal]) => (
                                                            <li key={objKey}><strong>{objKey}: </strong>{String(objVal)}</li>
                                                        ))}
                                                    </ul>
                                                ) : key.toLowerCase() === 'total' ? (
                                                    `$${value}`
                                                ) : key.toLowerCase() === 'date' ? (
                                                    new Date(value).toLocaleString(undefined, {
                                                        year: 'numeric',
                                                        month: 'long',
                                                        day: 'numeric',
                                                        hour: '2-digit',
                                                        minute: '2-digit'
                                                    })
                                                ) : String(value)}
                                            </span>
                                        </div>
                                    )
                                })}
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