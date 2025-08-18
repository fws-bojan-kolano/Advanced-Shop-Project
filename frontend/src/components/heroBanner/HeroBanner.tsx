import './heroBanner.scss';
import { Link } from 'react-router-dom';

export default function HeroBanner() {
    return (
        <div className="hero-banner">
            <div className="container">
                <div className="hero-banner__content">
                    <h1 className="page-title hero-banner__title">Need books?<br/> We have them!</h1>
                    <p className="hero-banner__sub-title">It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has</p>
                    <Link className='hero-banner__link' to="/shop">See all products</Link>
                </div>
            </div>
        </div>
    )
}