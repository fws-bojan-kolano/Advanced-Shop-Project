import { useContext, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { UserContext } from '../user/user-context';
import './header.scss';
import { useCart } from '../cart/cart-context';

export default function Header() {
    const {user} = useContext(UserContext);
    const {cart} = useCart();
    const location = useLocation();

    const totalCartItems = cart.reduce((total, item) => total + item.quantity, 0);

    useEffect(() => {
        console.log(user);
    }, [user]);

    return (
        <div className='header'>
            <div className="container">
                <div className="header__logo-wrapper">
                    <a className="header__logo-link" href="/"><img className="header__logo" src='../../src/assets/images/logo.png' alt='Logo' /></a>
                    {user ? (
                        <>
                            <span className="welcome">Welcome {user.username}</span>
                        </>
                    ) : null}
                    <nav className="header__list">
                        <li className='header__list-item'>
                            {!user ? <a className='header__link' href="/dashboard">Login</a> : null}
                        </li>
                        {user && location.pathname !== '/dashboard' && (
                            <li className='header__list-item header__list-item--my-account'><a className='header__link' href="/dashboard">My account</a></li>)
                        }
                        {user ? (
                            <li className='header__list-item'>
                                <a className='header__link' href="/cart">
                                    <svg className='header__cart-icon' xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512">
                                        <path d="M24 0C10.7 0 0 10.7 0 24S10.7 48 24 48l45.5 0c3.8 0 7.1 2.7 7.9 6.5l51.6 271c6.5 34 36.2 58.5 70.7 58.5L488 384c13.3 0 24-10.7 24-24s-10.7-24-24-24l-288.3 0c-11.5 0-21.4-8.2-23.6-19.5L170.7 288l288.5 0c32.6 0 61.1-21.8 69.5-53.3l41-152.3C576.6 57 557.4 32 531.1 32l-411 0C111 12.8 91.6 0 69.5 0L24 0zM131.1 80l389.6 0L482.4 222.2c-2.8 10.5-12.3 17.8-23.2 17.8l-297.6 0L131.1 80zM176 512a48 48 0 1 0 0-96 48 48 0 1 0 0 96zm336-48a48 48 0 1 0 -96 0 48 48 0 1 0 96 0z"/>
                                    </svg>
                                    <span className="header__total">
                                        {totalCartItems}
                                    </span>
                                </a>
                            </li>
                            ) : null
                        }
                    </nav>
                </div>
            </div>
        </div>
    )
}