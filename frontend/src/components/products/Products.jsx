import { useEffect, useState } from "react";
import { SERVER } from '../../utils/utils';
import Product from "../product/Product";
import './products.scss';

export default function Products() {
    const [products, setProducts] = useState([]);
    const [showLoader, setShowLoader] = useState(false);
    const [currentPage, sectCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const productsPerPage = 6;

    useEffect(() => {
        const fetchProducts = async () => {
            setShowLoader(true);

            try {
                const response = await fetch(`${SERVER}products?page=${currentPage}&limit=${productsPerPage}`);
                if (!response.ok) {
                    throw new Error("Failed to fetch products");
                }

                const data = await response.json();
                setProducts(data.products);
                setTotalPages(data.totalPages);
            } catch (error) {
                console.error("Error fetching products:", error);
            } finally {
                setShowLoader(false);
            }
        };

        fetchProducts();
    }, [currentPage]);

    //Change page
    const paginate = pageNumber => sectCurrentPage(pageNumber);

    const handleNext = () => {
        if(currentPage < totalPages) {
            sectCurrentPage(currentPage + 1);
        }
    };

    const handlePrevious = () => {
        if(currentPage > 1) {
            sectCurrentPage(currentPage - 1);
        }
    };

    return (
        <div className="products">
            <div className="container">
                <div className="row products__wrapper">
                    {showLoader && <span className='loader products__loader'></span>}
                    {products.map(product => (
                        <Product key={product.id} product={product} />
                    ))}
                </div>
                <div className="pagination">
                    <button 
                        className="pagination__button" 
                        onClick={handlePrevious} 
                        disabled={currentPage === 1}
                    >
                        &laquo; Previous
                    </button>

                    {Array.from({ length: totalPages }, (_, i) => (
                        <button 
                            key={i + 1} 
                            className={`pagination__number ${currentPage === i + 1 ? 'active' : ''}`}
                            onClick={() => paginate(i + 1)}
                        >
                            {i + 1}
                        </button>
                    ))}

                    <button 
                        className="pagination__button" 
                        onClick={handleNext} 
                        disabled={currentPage === totalPages}
                    >
                        Next &raquo;
                    </button>
                </div>
            </div>
        </div>
    )
}