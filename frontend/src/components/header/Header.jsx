import { useContext, useEffect } from 'react';
import { UserContext } from '../user/user-context';
import './header.scss';

export default function Header() {
    const {user} = useContext(UserContext);

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
                        {user ? (<li className='header__list-item'><a className='header__link' href="/dashboard">My account</a></li>) : null}
                        {user ? (<li className='header__list-item'><a className='header__link' href="#">Cart</a></li>) : null}
                    </nav>
                </div>
            </div>
        </div>
    )
}