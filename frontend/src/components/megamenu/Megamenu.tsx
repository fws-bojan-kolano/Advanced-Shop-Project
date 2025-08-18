
import './megamenu.scss';
import { SERVER } from '../../utils/utils';
import { useEffect } from 'react';
import {Link} from 'react-router-dom';
import { useUser } from '../user/user-context';

export default function Megamenu() {
    const { productsMegamenu, setProductsMegamenu } = useUser();

    useEffect(() => {
        const fetchProducts = async () => {
            if(productsMegamenu.length > 0) return;

            try {
                const response = await fetch(`${SERVER}products`);
                if (!response.ok) throw new Error("Failed to fetch products");

                const data = await response.json();
                setProductsMegamenu(data.products || []);
            } catch (error) {
                console.error("Error fetching products:", error);
            }
        };

        fetchProducts();
    }, [productsMegamenu, setProductsMegamenu]);

    const categories = Array.isArray(productsMegamenu) ? [...new Set(productsMegamenu.map(product => product.category))] : [];

    const handleCloseMegamenu = () => {
        const megamenu = document.querySelector('.js-megamenu');
        megamenu?.classList.remove('megamenu-open');
    };

    return (
        <div className='megamenu js-megamenu'>
            <div className="megamenu__content">
                <span className="megamenu__close js-megamenu__close" onClick={handleCloseMegamenu}>X</span>
                {categories.map((category, index) => (
                    <Link className='megamenu__link' key={index} to={`/category/${encodeURIComponent(category)}`}>{category}</Link>
                ))}
            </div>
        </div>
    )
}