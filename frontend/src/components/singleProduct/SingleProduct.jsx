import './singleProduct.scss';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { SERVER } from '../../utils/utils';

export default function SingleProduct() {
    const {id} = useParams();
    const [product, setProduct] = useState(null);

    useEffect(() => {
        window.scrollTo(0, 0);

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
        <div className="single-product">
            <div className="container">
                <div className="single-product__breadcrumbs">
                    <span>
                        <a href="/">Homepage</a> / <a href="/shop">Shop</a> / {product.name}
                    </span>
                </div>
                <div className="single-product__wrapper">
                    <div className="single-product__wrapper-left">
                        <h2 className="section-title single-product__title">{product.name}</h2>
                        <img src={product.image} alt={product.name} />
                    </div>
                    <div className="single-product__wrapper-right">
                        <p className="single-product__creator">By {product.creator}</p>
                        <p className="single-product__description">{product.description}</p>
                        <p className="single-product__price">Price: ${product.price}</p>
                    </div>
                </div>
            </div>
        </div>
    )
}