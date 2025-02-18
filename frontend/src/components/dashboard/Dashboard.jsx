import MyAccount from '../myAccount/MyAccount';
import './dashboard.scss';

export default function Dashboard() {
    return (
        <div className="dashboard">
            <div className="container">
                <h2 className="section-title dashboard__title">Dashboard</h2>
                <div className="dashboard__content">
                    <ul className="dashboard__content-list">
                        <li className="dashboard__content-list-item"><a className="dashboard__content-list-item-link" href="#">My Account</a></li>
                        <li className="dashboard__content-list-item"><a className="dashboard__content-list-item-link" href="#">Orders</a></li>
                    </ul>
                    <div className="dashboard__content-wrapper">
                        <MyAccount />
                    </div>
                </div>
            </div>
        </div>
    )
}