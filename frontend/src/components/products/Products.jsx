import { useEffect, useRef, useState } from "react";
import { SERVER } from '../../utils/utils';
import Product from "../product/Product";
import { useParams, useLocation } from 'react-router-dom';
import './products.scss';
import Filters from "../filters/Filters";

export default function Products() {
    const [products, setProducts] = useState([]);
    const [showLoader, setShowLoader] = useState(false);
    const [currentPage, sectCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [sortOrder, setSortOrder] = useState('asc');
    const [presentedOrderValue, setPresentedOrderValue] = useState('Ascending');
    const [isSortingListOpen, setIsSortingListOpen] = useState(false);
    const productsPerPage = 6;
    const [filters, setFilters] = useState({
        categories: [],
        priceMin: '',
        priceMax: '',
        creators: [],
        recommended: null
    });

    const productsRef = useRef(null);
    const {categoryName} = useParams();
    const location = useLocation();
    const query = new URLSearchParams(location.search);
    const searchQuery = query.get('search');

    const allCategories = Array.from(new Set(products.map(p => p.category)));
    const allCreators = Array.from(new Set(products.map(p => p.creator)));

    useEffect(() => {
        const fetchProducts = async () => {
            setShowLoader(true);

            try {

                if(searchQuery && searchQuery.trim() !== '') {
                    sectCurrentPage(1);

                    const res = await fetch(`${SERVER}search?query=${encodeURIComponent(searchQuery)}&page=${currentPage}&limit=${productsPerPage}`);
                    const data = await res.json();
                    setProducts(data.products || data);

                    const total = data.total || (data.products ? data.products.length: 0);
                    setTotalPages(data.totalPages || 1);
                    return;
                }

                const params = new URLSearchParams();
                params.append('page', currentPage);
                params.append('limit', productsPerPage);
                params.append('sort', sortOrder);

                if (categoryName) {
                    params.append('category', categoryName);
                }

                if (filters.categories.length) {
                    filters.categories.forEach(cat => params.append('categories[]', cat));
                }

                if (filters.creators.length) {
                    filters.creators.forEach(cre => params.append('creators[]', cre));
                }

                if (filters.priceMin !== '') {
                    params.append('priceMin', filters.priceMin);
                }

                if (filters.priceMax !== '') {
                    params.append('priceMax', filters.priceMax);
                }

                if (filters.recommended !== null) {
                    params.append('recommended', filters.recommended);
                }

                const response = await fetch(`${SERVER}products?${params.toString()}`);
                if (!response.ok) {
                    throw new Error("Failed to fetch products");
                }

                const data = await response.json();
                setProducts(data.products);
                setTotalPages(data.totalPages || 1);
            } catch (error) {
                console.error("Error fetching products:", error);
            } finally {
                setShowLoader(false);
            }
        };

        fetchProducts();
    }, [currentPage, sortOrder, categoryName, filters, location.search]);

    useEffect(() => {
        sectCurrentPage(1);
    }, [filters, categoryName]);

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

    const handleSortAndClose = (order) => {
        setIsSortingListOpen(false);
        setSortOrder(order);
        sectCurrentPage(1);

        switch (order) {
            case 'asc':
                setPresentedOrderValue('Ascending');
                break;
            case 'desc':
                setPresentedOrderValue('Descending');
                break;
            case 'price_low':
                setPresentedOrderValue('Lowest price');
                break;
            case 'price_high':
                setPresentedOrderValue('Highest price');
                break;
            default:
                break;
        }
    };

    const toggleSortingList = () => {
        setIsSortingListOpen(prev => !prev);
    };

    return (
        <div className="products" ref={productsRef}>
            <div className="container">
                <div className="products__top-content">
                    <h2 className="section-title products__title">{categoryName ? `Category: ${categoryName}` : 'All Products'}</h2>
                    <div className="products__sorting">
                        <span className="products__sorting-label" onClick={toggleSortingList}>Sorted By: {presentedOrderValue}</span>
                        <ul className={`products__sorting-list ${isSortingListOpen ? 'open' : ''}`}>
                            <li className="products__sorting-list-item" onClick={() => handleSortAndClose('asc')}>Ascending</li>
                            <li className="products__sorting-list-item" onClick={() => handleSortAndClose('desc')}>Descending</li>
                            <li className="products__sorting-list-item" onClick={() => handleSortAndClose('price_low')}>Lowest price</li>
                            <li className="products__sorting-list-item" onClick={() => handleSortAndClose('price_high')}>Highest price</li>
                        </ul>
                    </div>
                </div>
                <Filters
                    filters={filters}
                    setFilters={setFilters}
                    categories={allCategories}
                    creators={allCreators}
                />
                <div className="row products__wrapper">
                    {showLoader && <span className='loader products__loader'></span>}
                    {products.map(product => (<Product key={product.id} product={product} />))}
                </div>
                <div className="pagination">
                    <button 
                        className="pagination__button" 
                        onClick={handlePrevious} 
                        disabled={currentPage === 1}
                    >
                        &laquo; Prev
                    </button>

                    {currentPage > 3 && totalPages > 5 && (<span className="pagination__dots">...</span>)}

                    {generatePageNumbers().map(pageNumber => (
                        <button 
                            key={pageNumber} 
                            className={`pagination__number ${currentPage === pageNumber ? 'active' : ''}`}
                            onClick={() => paginate(pageNumber)}
                        >
                            {pageNumber}
                        </button>
                    ))}

                    {currentPage < totalPages - 2 && totalPages > 5 && (<span className="pagination__dots">...</span>)}

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