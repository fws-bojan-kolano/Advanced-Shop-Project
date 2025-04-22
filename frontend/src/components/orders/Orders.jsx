import { useContext } from 'react';
import { UserContext } from '../user/user-context';
import './orders.scss';
import { Link } from 'react-router-dom';

export default function Orders() {
    const { user } = useContext(UserContext);

    return (
        <div className="orders">
            {!user?.orders || user?.orders?.length === 0 ? (
                <p>You have not placed any orders yet.</p>
            ) : (
                <table className="orders__table">
                    <tr>
                        <th className='orders__heading'>Product ID</th>
                        <th className='orders__heading'>Date</th>
                        <th className='orders__heading'>Email</th>
                        <th className='orders__heading'>Phone</th>
                        <th className='orders__heading'>Total</th>
                        <th className='orders__heading'></th>
                    </tr>
                    {user.orders.map((order, index) => (
                        <tr className='orders__row' key={order.id}>
                            <td className='orders__column'>
                                <span className="orders__list-id">{order.name}</span>
                            </td>
                            <td className='orders__column'>
                                <span className="orders__list-date">{new Date(order.date).toLocaleString()}</span>
                            </td>
                            <td className='orders__column'>
                                <span className="orders__list-email">{order.email}</span>
                            </td>
                            <td className='orders__column'>
                                <span className="orders__list-phone">{order.phone}</span>
                            </td>
                            <td className='orders__column'>
                                <span className="orders__list-total"><strong>${order.total}</strong></span>
                            </td>
                            <td className='orders__column'>
                                <span className="orders__list-open"><Link className='btn order__list-btn' to={`/order/${order.orderId}`}>Open</Link></span>
                            </td>
                        </tr>
                    ))}
                </table>
            )}
        </div>
    )
}