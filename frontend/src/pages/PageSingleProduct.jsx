import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { SERVER } from '../utils/utils';
import Recommended from '../components/recommended/Recommended';

const PageSingleProduct = () => {
    const {id} = useParams();
    const [product, setProduct] = useState(null);

    useEffect(() => {
        const fetchProduct = async () => {
            const response = await fetch(`${SERVER}products/${id}`);
            if(!response.ok) {
                console.error('Product not found!');
                return;
            }

            const data = await response.json();
            setProduct(data);
        }

        fetchProduct();
    }, [id]);

    if(!product) {
        return <div>Loading...</div>
    }

    return (
        <div className="product-page">
            <div className="container">
                <div className="product-page__wrapper">
                    <h2 className="section-title product-page__title">{product.name}</h2>
                    <img src={product.image} alt={product.name} />
                    <p className="product-page__creator">By {product.creator}</p>
                    <p className="product-page__description">{product.description}</p>
                    <p className="product-page__price">Price: ${product.price}</p>
                </div>
                <Recommended />
            </div>
        </div>
    )
}

export default PageSingleProduct;