import { useEffect, useState } from 'react';
import { SERVER } from '../../utils/utils';
import './changeProduct.scss';
import { useUser } from '../user/user-context';

export default function ChangeProduct() {
    const [showError, setShowError] = useState(false);
    const [showErrorChange, setShowErrorChange] = useState(false);
    const [showSuccessRemove, setSuccessRemove] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);
    const [showLoader, setShowLoader] = useState(false);
    const [editingProductId, setEditingProductId] = useState(null);
    const [editedProduct, setEditedProduct] = useState(null);
    const [products, setProducts] = useState([]);
    const {setProductsMegamenu} = useUser();

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await fetch(`${SERVER}products`, {
                    method: "GET",
                });

                if(!response.ok) {
                    throw new Error("Failed to fetch products!");
                }

                const data = await response.json();

                setProducts(Array.isArray(data.products) ? data.products : []);
                setShowError(false);
            } catch (error) {
                setShowError(true);
                console.error("Error fetching products:", error);
            }
        };

        fetchProducts();
    }, []);

    const updateProductsInMegamenu = async () => {
        const updatedProducts = await fetch(`${SERVER}products`).then(res => res.json());
        setProductsMegamenu(updatedProducts);
    }

    const handleRemove = async (productId) => {
        setEditingProductId(null);
        setEditedProduct(null);

        try {
            const response = await fetch(`${SERVER}products/${productId}`, {
                method: 'DELETE',
            });

            if(response.ok) {
                setProducts(prevProducts => prevProducts.filter(product => product.id !== productId));
                setSuccessRemove(true);
                updateProductsInMegamenu();
                setTimeout(() => {
                    setSuccessRemove(false);
                }, 1000);
            } else {
                setSuccessRemove(false);
                throw new Error("Failed to remove product");
            }

        } catch (error) {
            setShowError(true);
            throw new Error("Error removing product: ", error);
        }
    };

    const handleDropdown = (product) => {
        if(editingProductId === product.id) {
            setEditingProductId(null);
            setEditedProduct(null);
        } else {
            setEditingProductId(product.id);
            setEditedProduct({
                name: product.name,
                price: product.price,
                creator: product.creator,
                description: product.description,
                image: product.image,
                recommended: product.recommended,
                category: product.category
            });
        }
    };
    
    const handleInputChange = (field, value) => {
        setEditedProduct(prev => ({
            ...prev,
            [field]: value,
        }));
    };

    const handleUpdate = async (event) => {
        event.preventDefault();

        setShowLoader(true);

        const payload = {};
        Object.entries(editedProduct).forEach(([key, value]) => {
            if(typeof value === 'string' && value.trim() !== '') {
                payload[key] = value;
            } else if(typeof value === 'number' || typeof value === 'boolean') {
                payload[key] = value;
            }
        });

        if(Object.keys(payload).length === 0) {
            setShowErrorChange(true);
            setShowLoader(false);
            return;
        }

        try {
            const response = await fetch(`${SERVER}products/${editingProductId}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload)
            });

            if (!response.ok) {
                throw new Error("Failed to update product!");
            }

            const updatedProduct = {...products.find(product => product.id === editingProductId), ...payload};

            setProducts(products.map(product => product.id === editingProductId ? {...product, ...payload} : product));

            setEditedProduct(updatedProduct);//update input fields after succesfull change

            setShowSuccess(true);
            setShowLoader(false);
            updateProductsInMegamenu();
            setTimeout(() => {
                setShowSuccess(false);
                setEditingProductId(null);
                setEditedProduct(null);
            }, 1000);
        } catch (error) {
            setShowErrorChange(true);
            setShowLoader(false);
        }
    };

    return (
        <div className="change-product">
            {showError && <span className='form-message form-error change__error'>Enter correct data!</span>}
            {showSuccessRemove && <span className='form-message form-success change__success'>Data removed!</span>}
            <ul className="change-users__list">
                {
                    products.map(product => 
                    (
                        <li className="change-users__list-item" key={product.id}>
                            <div className="change-users__list-item-top">
                                <div className="change-users__list-item-left">
                                    <span className="change-users__list-item-name">{product.name}</span>
                                </div>
                                <div className="change-users__list-item-right">
                                    <span className="change-users__list-button change-users__list-remove" onClick={() => handleRemove(product.id)}>Remove</span>
                                    <span className="change-users__list-button change-users__list-change" onClick={() => handleDropdown(product)}>Change</span>
                                </div>
                            </div>
                        </li>
                    )
                )}
            </ul>
            {editingProductId !== null && editedProduct && 
                <div className="change-users__list-item-bottom">
                    <form className="change-users__form" onSubmit={handleUpdate}>
                        <div className="my-account__form-fields">
                            <div className="input-wrapper">
                                <input 
                                    type="text" 
                                    className="form-input" 
                                    placeholder="Product Name" 
                                    value={editedProduct.name} 
                                    onChange={(e) => handleInputChange("name", e.target.value)} 
                                    />
                            </div>
                            <div className="input-wrapper">
                                <input 
                                    type="number" 
                                    className="form-input" 
                                    placeholder="Product Price"
                                    value={editedProduct.price} 
                                    onChange={(e) => handleInputChange("price", e.target.value)} 
                                    />
                            </div>
                            <div className="input-wrapper">
                                <input 
                                    type="text" 
                                    className="form-input" 
                                    placeholder="Product Creator"
                                    value={editedProduct.creator} 
                                    onChange={(e) => handleInputChange("creator", e.target.value)} 
                                    />
                            </div>
                            <div className="input-wrapper">
                                <input 
                                    type="text" 
                                    className="form-input" 
                                    placeholder="Product Description"
                                    value={editedProduct.description} 
                                    onChange={(e) => handleInputChange("description", e.target.value)} 
                                    />
                            </div>
                            <div className="input-wrapper">
                                <input 
                                    type="text" 
                                    className="form-input" 
                                    placeholder="Product Category"
                                    value={editedProduct.category} 
                                    onChange={(e) => handleInputChange("category", e.target.value)} 
                                    />
                            </div>
                            <div className="input-wrapper">
                                <div className="register__radio-wrapper">
                                    <p>Recommended:</p>
                                    <div className="register__radio-wrapper-item">
                                        <input 
                                            type="radio" 
                                            id="recommyes" 
                                            name="recomm" 
                                            value="yes" 
                                            checked={editedProduct.recommended === true} 
                                            onChange={(e) => handleInputChange("recommended", true)} 
                                            />
                                        <label htmlFor="recommyes">Yes</label>
                                    </div>
                                    <div className="register__radio-wrapper-item">
                                        <input 
                                            type="radio" 
                                            id="recommno" 
                                            name="recomm" 
                                            value="false" 
                                            checked={editedProduct.recommended === false} 
                                            onChange={(e) => handleInputChange("recommended",false)} 
                                            />
                                        <label htmlFor="recommno">No</label>
                                    </div>
                                </div>
                            </div>
                            <div className="input-wrapper">
                                <input 
                                    type="text" 
                                    className="form-input" 
                                    placeholder="Image" 
                                    value={editedProduct.image}
                                    onChange={(e) => handleInputChange("image", e.target.value)} 
                                    />
                            </div>
                        </div>
                        <input className='my-account__form-submit' type="submit" value="Update" />
                        {showLoader && <span className='loader my-account__loader'></span>}
                        {showSuccess && <span className='form-message form-success my-account__success'>Product updated successfully!</span>}
                        {showErrorChange && <span className='form-message form-error change__error'>Enter correct data!</span>}
                    </form>
                </div>
            }
        </div>
    )
}