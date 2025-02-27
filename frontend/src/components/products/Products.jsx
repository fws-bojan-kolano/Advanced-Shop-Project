import { useEffect, useState } from "react";
import { SERVER } from '../../utils/utils';
import Product from "../product/Product";
import './products.scss';

export default function Products() {
    const [products, setProducts] = useState([]);
    const [showLoader, setShowLoader] = useState(false);

    useEffect(() => {
        const fetchProducts = async () => {
            setShowLoader(true);

            try {
                const response = await fetch(`${SERVER}products`);
                if (!response.ok) {
                    throw new Error("Failed to fetch products");
                }

                const data = await response.json();
                setProducts(data.products);
            } catch (error) {
                console.error("Error fetching products:", error);
            } finally {
                setShowLoader(false);
            }
        };

        fetchProducts();
    }, []);

    return (
        <div className="products">
            <div className="container">
                <div className="row products__wrapper">
                    {showLoader && <span className='loader products__loader'></span>}
                    {products.map(product => (
                        <Product key={product.id} product={product} />
                    ))}
                </div>
            </div>
        </div>
    )
}