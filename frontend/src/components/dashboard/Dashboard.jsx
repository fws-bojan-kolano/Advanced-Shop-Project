import './dashboard.scss';
import { useContext, useState } from "react";
import MyAccount from '../myAccount/MyAccount';
import ChangeUsers from '../changeUsers/ChangeUsers';
import { UserContext } from '../user/user-context';
import AddNewProduct from "../addNewProduct/AddNewProduct";
import ChangeProduct from "../changeProduct/ChangeProduct";

export default function Dashboard() {
    const {user} = useContext(UserContext);

    const [activeSection, setActiveSection] = useState('myAccount');

    const handleSectionClick = (section) => {
        setActiveSection(section);
    }

    return (
        <div className="dashboard">
            <div className="container">
                <h2 className="section-title dashboard__title">Dashboard</h2>
                <div className="dashboard__content">
                    <ul className="dashboard__content-list">
                        <li className="dashboard__content-list-item">
                            {/* Napraviti da trenutno izabran ima active clasu sa nekim stilom */}
                            <span className="dashboard__content-list-item-link" onClick={() => handleSectionClick('myAccount')}>My Account</span>
                        </li>
                        {
                            user.role === 'user' && (
                                <li className="dashboard__content-list-item">
                                    <span className="dashboard__content-list-item-link" onClick={() => handleSectionClick('orders')}>Orders</span>
                                </li>
                            )
                        }
                        {
                            user.role === 'admin' && (
                                <li className="dashboard__content-list-item">
                                    <span className="dashboard__content-list-item-link" onClick={() => handleSectionClick('changeUsers')}>Change Users</span>
                                </li>
                            )
                        }
                        {
                            user.role === 'admin' && (
                                <li className="dashboard__content-list-item">
                                    <span className="dashboard__content-list-item-link" onClick={() => handleSectionClick('addNewProduct')}>Add New Product</span>
                                </li>
                            )
                        }
                        {
                            user.role === 'admin' && (
                                <li className="dashboard__content-list-item">
                                    <span className="dashboard__content-list-item-link" onClick={() => handleSectionClick('changeProduct')}>Change Product</span>
                                </li>
                            )
                        }
                    </ul>
                    <div className="dashboard__content-wrapper">
                        {activeSection === 'myAccount' && <MyAccount />}
                        {activeSection === 'orders' && <div>Orders Section</div>}
                        {activeSection === 'changeUsers' && <ChangeUsers />}
                        {activeSection === 'addNewProduct' && <AddNewProduct />}
                        {activeSection === 'changeProduct' && <ChangeProduct />}
                    </div>
                </div>
            </div>
        </div>
    )
}