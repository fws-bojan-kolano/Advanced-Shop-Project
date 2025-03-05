import './recommended.scss';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Slider from 'react-slick';
import { useEffect, useState } from 'react';
import { SERVER } from '../../utils/utils';
import {Link, useParams} from 'react-router-dom';

export default function Recommended() {
    const {id} = useParams();
    const [recommendedProducts, setRecommendedProducts] = useState([]);

    const settings = {
        dots: true,
        infinite: true,
        speed: 500,
        slidesToShow: 4,
        slidesToScroll: 1,
        responsive: [
            {
                breakpoint: 992,
                settings: {
                    slidesToShow: 3
                }
            },
            {
                breakpoint: 767,
                settings: {
                    slidesToShow: 2
                }
            },
            {
                breakpoint: 576,
                settings: {
                    slidesToShow: 1
                }
            }
        ]
    }

    useEffect(() => {
        const fetchRecommendedProducts = async () => {
            const response = await fetch(`${SERVER}products/recommended?id=${id}`);
            if (!response.ok) {
                throw new Error("Failed to fetch recommended products");
            }

            const data = await response.json();
            setRecommendedProducts(data);
        }

        console.log(recommendedProducts);
        fetchRecommendedProducts();
    }, [id]);

    const handleScrollTop = () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    };

    return (
        <div className="recommended">
            <div className="container">
                <h2 className="recommended__title">Recommended</h2>
                <Slider {...settings}>
                    {recommendedProducts.map(product => (
                        <div className="recommended__slide" key={product.id}>
                            <div className="recommended__slide-wrapp">
                                <Link to={`/product/${product.id}`} className='recommended__slide-link' onClick={handleScrollTop}>
                                    <div className="recommended__slide-image-box">
                                        <img className='recommended__slide-image' src={product.image} alt={product.name} />
                                    </div>
                                    <h3 className="recommended__slide-name">{product.name}</h3>
                                    <p className="recommended__slide-creator">By {product.creator}</p>
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