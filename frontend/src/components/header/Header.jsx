import './header.scss';

export default function Header() {

    return (
        <div className='header'>
            <div className="container">
                <div className="header__logo-wrapper">
                    <a className="header__logo-link" href="/"><img className="header__logo" src='../../src/assets/images/logo.png' alt='Logo' /></a>
                    <nav className="header__list">
                        <li className='header__list-item'><a className='header__link' href="/dashboard">Login</a></li>
                        <li className='header__list-item'><a className='header__link' href="#">Cart</a></li>
                    </nav>
                </div>
            </div>
        </div>
    )
}