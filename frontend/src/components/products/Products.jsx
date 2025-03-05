import { useEffect, useRef, useState } from "react";
import { SERVER } from '../../utils/utils';
import Product from "../product/Product";
import './products.scss';

export default function Products() {
    const [products, setProducts] = useState([]);
    const [showLoader, setShowLoader] = useState(false);
    const [currentPage, sectCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const productsPerPage = 6;

    const productsRef = useRef(null);

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

    useEffect(() => {
        if(productsRef.current) {
            const top = productsRef.current.getBoundingClientRect().top + window.scrollY;
            window.scrollTo({ top: top - 100, behavior: "smooth" });
        }
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

    const generatePageNumbers = () => {
        const pageNumbers = [];
        let startpage, endpage;

        if(totalPages <= 5) {
            startpage = 1;
            endpage = totalPages;
        } else {
            if(currentPage <= 3) {
                startpage = 1;
                endpage = 5;
            } else if (currentPage >= totalPages - 2) {
                startpage = totalPages - 4;
                endpage = totalPages;
            } else {
                startpage = currentPage - 2;
                endpage = currentPage + 2;
            }
        }

        for (let i = startpage; i <= endpage; i++) {
            pageNumbers.push(i);
        }
        return pageNumbers;
    };

    return (
        <div className="products" ref={productsRef}>
            <div className="container">
                <h2 className="section-title products__title">Products</h2>
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
                        &laquo; Prev
                    </button>

                    {currentPage > 3 && totalPages > 5 && (
                        <span className="pagination__dots">...</span>
                    )}

                    {generatePageNumbers().map(pageNumber => (
                        <button 
                            key={pageNumber} 
                            className={`pagination__number ${currentPage === pageNumber ? 'active' : ''}`}
                            onClick={() => paginate(pageNumber)}
                        >
                            {pageNumber}
                        </button>
                    ))}

                    {currentPage < totalPages - 2 && totalPages > 5 && (
                        <span className="pagination__dots">...</span>
                    )}

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