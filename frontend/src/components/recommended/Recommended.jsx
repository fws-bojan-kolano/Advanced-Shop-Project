import './recommended.scss';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Slider from 'react-slick';
import { useEffect, useState } from 'react';
import { SERVER } from '../../utils/utils';
import {Link} from 'react-router-dom';

export default function Recommended() {
    const [recommendedProducts, setRecommendedProducts] = useState([]);

    const settings = {
        dots: true,
        infinite: true,
        speed: 500,
        slidesToShow: 3,
        slidesToScroll: 1,
    }

    useEffect(() => {
        const fetchRecommendedProducts = async () => {
            const response = await fetch(`${SERVER}products/recommended`);
            const data = await response.json();
            setRecommendedProducts(data);
        }

        console.log(recommendedProducts);
        fetchRecommendedProducts();
    }, []);

    return (
        <div className="recommended">
            <div className="container">
                <Slider {...settings}>
                    {recommendedProducts.map(product => (
                        <div className="recommended__slide" key={product.id}>
                            <div className="recommended__slide-wrapp">
                                <Link to={`/product/${product.id}`} className='recommended__slide-link'>
                                    <img className='recommended__slide-image' src={product.iamge} alt={product.name} />
                                    <h3 className="recommended__slide-name">{product.name}</h3>
                                    <p className="recommended__slide-creator">{product.creator}</p>
                                    <p className="recommended__slide-price">${product.price}</p>
                                </Link>
                            </div>
                        </div>
                    ))}
                </Slider>
            </div>
        </div>
    )
}