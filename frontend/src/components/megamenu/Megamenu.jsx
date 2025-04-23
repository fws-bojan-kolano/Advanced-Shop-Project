
import './megamenu.scss';
import { SERVER } from '../../utils/utils';
import { useEffect, useState } from 'react';
import {Link} from 'react-router-dom';

export default function Megamenu() {
    const [products, setProducts] = useState([]);

    useEffect(() => {
        const fetchProducts = async () => {

            try {
                const response = await fetch(`${SERVER}products`);
                if (!response.ok) {
                    throw new Error("Failed to fetch products");
                }

                const data = await response.json();
                setProducts(data.products || []);
            } catch (error) {
                console.error("Error fetching products:", error);
            }
        };

        fetchProducts();
    }, []);

    const categories = [...new Set(products.map(product => product.category))];

    const handleCloseMegamenu = () => {
        const megamenu = document.querySelector('.js-megamenu');
        megamenu?.classList.remove('megamenu-open');
    };

    return (
        <div className='megamenu js-megamenu'>
            <div className="megamenu__content">
                <span className="megamenu__close js-megamenu__close" onClick={handleCloseMegamenu}>X</span>
                {categories.map((category, index) => (
                    <Link className='megamenu__link' key={index} to={`/category/${category}`}>{category}</Link>
                ))}
            </div>
        </div>
    )
}