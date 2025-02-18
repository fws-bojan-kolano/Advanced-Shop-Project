import './footer.scss';

export default function Footer() {
    return (
        <div className="footer">
            <div className="container">
                <div className="row footer__content">
                    <div className="col-xl-6 col-lg-4 col-md-4 col-sm-12">
                        <a href="/" className="footer__logo"><img className="header__logo" src='../../src/assets/images/logo.png' alt='Logo' /></a>
                        <span className="footer__logo-sub">I like books!</span>
                    </div>
                    <div className="col-xl-3 col-lg-4 col-md-4 col-sm-12">
                        <ul>
                            <li className='footer__list-item'><a href="/">Some page here</a></li>
                            <li className='footer__list-item'><a href="/">Another page here</a></li>
                            <li className='footer__list-item'><a href="/">More pages here</a></li>
                        </ul>
                    </div>
                    <div className="col-xl-3 col-lg-4 col-md-4 col-sm-12">
                        <ul>
                            <li className='footer__list-item'><a href="/">Some page here</a></li>
                            <li className='footer__list-item'><a href="/">Another page here</a></li>
                            <li className='footer__list-item'><a href="/">More pages here</a></li>
                        </ul>
                    </div>
                </div>
                <div className="footer__copyright">
                    <p className="footer__copyright-text">Created and owned by Bojan Kolano.</p>
                </div>
            </div>
        </div>
    )
}