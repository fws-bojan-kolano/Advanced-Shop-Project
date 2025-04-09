import './dashboard.scss';
import { useContext, useState } from "react";
import MyAccount from '../myAccount/MyAccount';
import ChangeUsers from '../changeUsers/ChangeUsers';
import { UserContext } from '../user/user-context';
import AddNewProduct from "../addNewProduct/AddNewProduct";
import ChangeProduct from "../changeProduct/ChangeProduct";
import Orders from '../orders/Orders';

export default function Dashboard() {
    const {user, setUser} = useContext(UserContext);

    const [activeSection, setActiveSection] = useState('myAccount');

    const handleSectionClick = (section) => {
        setActiveSection(section);
    }

    const handleLogout = () => {
        setUser(null);
    }

    return (
        <div className="dashboard">
            <div className="container">
                <h2 className="section-title dashboard__title">Dashboard</h2>
                <div className="dashboard__content">
                    <ul className="dashboard__content-list">
                        <li className={`dashboard__content-list-item ${activeSection === 'myAccount' ? 'active' : ''}`}>
                            <span className="dashboard__content-list-item-link" onClick={() => handleSectionClick('myAccount')}>My Account</span>
                        </li>
                        <li className={`dashboard__content-list-item ${activeSection === 'orders' ? 'active' : ''}`}>
                            <span className="dashboard__content-list-item-link" onClick={() => handleSectionClick('orders')}>Orders</span>
                        </li>
                        {user.role === 'admin' && (
                            <li className={`dashboard__content-list-item ${activeSection === 'changeUsers' ? 'active' : ''}`}>
                                <span className="dashboard__content-list-item-link" onClick={() => handleSectionClick('changeUsers')}>Change Users</span>
                            </li>
                        )}
                        {user.role === 'admin' && (
                            <li className={`dashboard__content-list-item ${activeSection === 'addNewProduct' ? 'active' : ''}`}>
                                <span className="dashboard__content-list-item-link" onClick={() => handleSectionClick('addNewProduct')}>Add New Product</span>
                            </li>
                        )}
                        {user.role === 'admin' && (
                            <li className={`dashboard__content-list-item ${activeSection === 'changeProduct' ? 'active' : ''}`}>
                                <span className="dashboard__content-list-item-link" onClick={() => handleSectionClick('changeProduct')}>Change Product</span>
                            </li>
                        )}
                        <li className="dashboard__content-list-item">
                            <button className='dashboard__content-list-item-link hero-banner__link dashboard__content-list-item-link--logout' onClick={handleLogout}>Log Out</button>
                        </li>
                    </ul>
                    <div className="dashboard__content-wrapper">
                        {activeSection === 'myAccount' && <MyAccount />}
                        {activeSection === 'orders' && <div><Orders /></div>}
                        {activeSection === 'changeUsers' && <ChangeUsers />}
                        {activeSection === 'addNewProduct' && <AddNewProduct />}
                        {activeSection === 'changeProduct' && <ChangeProduct />}
                    </div>
                </div>
            </div>
        </div>
    )
}