import { useEffect, useMemo, useRef, useState } from "react";
import { SERVER } from '../../utils/utils';
import Product from "../product/Product";
import { useParams, useLocation } from 'react-router-dom';
import { SORT_OPTIONS } from "../../utils/utils";
import './products.scss';
import Filters from "../filters/Filters";

export default function Products() {
    const [products, setProducts] = useState([]);
    const [showLoader, setShowLoader] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [sortOrder, setSortOrder] = useState('asc');
    const [presentedOrderValue, setPresentedOrderValue] = useState('Ascending');
    const [isSortingListOpen, setIsSortingListOpen] = useState(false);
    const [noResultsMessage, setNoResultsMessage] = useState('');
    const [allCategories, setAllCategories] = useState([]);
    const [allCreators, setAllCreators] = useState([]);
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

    const buildQueryParams = () => {
        const params = new URLSearchParams();
        params.append('page', currentPage);
        params.append('limit', productsPerPage);
        params.append('sort', sortOrder);

        if (searchQuery?.trim() !== '') params.append('query', searchQuery);
        if (categoryName) params.append('category', categoryName);
        filters?.categories?.forEach(cat => params.append('category', cat));
        filters?.creators?.forEach(cre => params.append('creators', cre));
        if (filters.priceMin !== '') params.append('priceMin', filters.priceMin);
        if (filters.priceMax !== '') params.append('priceMax', filters.priceMax);
        if (filters.recommended !== null) params.append('recommended', filters.recommended);

        return params;
    };

    useEffect(() => {
        const fetchFilters = async () => {
            try {
                const res = await fetch(`${SERVER}filters`);
                const data = await res.json();
                setAllCategories(data.categories);
                setAllCreators(data.creators);
            } catch (error) {
                console.error("Error fetching filters:", error);
            }
        };
    
        fetchFilters();
    }, []);

    useEffect(() => {
        const fetchProducts = async () => {
            setShowLoader(true);
            setNoResultsMessage('');

            try {
                const params = buildQueryParams();
                const endpoint = searchQuery ? 'search' : 'products';
                const response = await fetch(`${SERVER}${endpoint}?${params.toString()}`);
                if (!response.ok) throw new Error("Failed to fetch products");

                const data = await response.json();
                setProducts(data.products);
                setTotalPages(data.totalPages || 1);
                data.total === 0 ? setNoResultsMessage(data.message) : setNoResultsMessage('');

                if (searchQuery) {
                    setAllCategories(data.categories || []);
                    setAllCreators(data.creators || []);
                }
            } catch (error) {
                console.error("Error fetching products:", error);
            } finally {
                setShowLoader(false);
            }
        };

        fetchProducts();
    }, [currentPage, sortOrder, categoryName, filters, location.search]);

    useEffect(() => {
        setCurrentPage(1);
    }, [filters, categoryName, searchQuery]);

    useEffect(() => {
        if(productsRef.current) {
            const top = productsRef.current.getBoundingClientRect().top + window.scrollY;
            window.scrollTo({ top: top - 100, behavior: "smooth" });
        }
    }, [currentPage]);

    //Change page
    const paginate = pageNumber => setCurrentPage(pageNumber);

    const handleNext = () => {
        if(currentPage < totalPages) setCurrentPage(currentPage + 1);
    };

    const handlePrevious = () => {
        if(currentPage > 1) setCurrentPage(currentPage - 1);
    };

    const generatePageNumbers = useMemo(() => {
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
    }, [totalPages, currentPage]);

    const handleSortAndClose = (order) => {
        const selected = SORT_OPTIONS.find(opt => opt.value === order);
        setPresentedOrderValue(selected?.label || 'Sort')
        setSortOrder(order);
        setCurrentPage(1);
        setIsSortingListOpen(false);
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
                            {SORT_OPTIONS.map(opt => (
                                <li key={opt.value} className="products__sorting-list-item" onClick={() => handleSortAndClose(opt.value)}>{opt.label}</li>
                            ))}
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
                    {noResultsMessage && <div className="products__no-results-message">{noResultsMessage}</div>}
                    {products.map(product => (<Product key={product.id} product={product} />))}
                </div>
                <div className="pagination">
                    <button className="pagination__button" onClick={handlePrevious} disabled={currentPage === 1}>
                        &laquo; Prev
                    </button>

                    {currentPage > 3 && totalPages > 5 && (<span className="pagination__dots">...</span>)}

                    {generatePageNumbers.map(pageNumber => (
                        <button 
                            key={pageNumber} 
                            className={`pagination__number ${currentPage === pageNumber ? 'active' : ''}`}
                            onClick={() => paginate(pageNumber)}
                        >
                            {pageNumber}
                        </button>
                    ))}

                    {currentPage < totalPages - 2 && totalPages > 5 && (<span className="pagination__dots">...</span>)}

                    <button className="pagination__button" onClick={handleNext} disabled={currentPage === totalPages}>
                        Next &raquo;
                    </button>
                </div>
            </div>
        </div>
    )
}