import { SERVER } from '../../utils/utils';
import './addNewProduct.scss';
import { useRef, useState } from 'react';
import { useUser } from '../user/user-context';

export default function AddNewProduct() {
    const [showLoader, setShowLoader] = useState(false);
    const [showError, setShowError] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);
    const [recommended, setRecommended] = useState('yes');
    const {setProductsMegamenu} = useUser();

    const productNameRef = useRef(null);
    const productPriceRef = useRef(null);
    const productCreatorRef = useRef(null);
    const productDescriptionRef = useRef(null)
    const productImageRef = useRef(null);
    const productCategoryRef = useRef(null);

    const handleSubmit = async (event) => {
        event.preventDefault();

        const productNameValue = productNameRef.current.value;
        const productPriceValue = productPriceRef.current.value;
        const productCreatorValue = productCreatorRef.current.value;
        const productImageValue = productImageRef.current.value;
        const productDescriptionValue = productDescriptionRef.current.value;
        const recommendedValue = recommended;
        const productCategoryValue = productCategoryRef.current.value;

        setShowLoader(true);

        try {
            const response = await fetch(`${SERVER}products/new`, {
                method: "POST",
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({
                    name: productNameValue,
                    price: productPriceValue,
                    creator: productCreatorValue,
                    description: productDescriptionValue,
                    image: productImageValue,
                    recommended: recommendedValue,
                    category: productCategoryValue
                })
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const result = await response.json();
            if (result.success) {
                setShowLoader(false);
                setShowError(false);
                setShowSuccess(true);

                const updatedProducts = await fetch(`${SERVER}products`).then(res => res.json());
                setProductsMegamenu(updatedProducts);

                productNameRef.current.value = '';
                productPriceRef.current.value = '';
                productCreatorRef.current.value = '';
                productImageRef.current.value = '';
                productDescriptionRef.current.value = '';
                productCategoryRef.current.value = '';
            } else {
                setShowLoader(false);
                setShowError(true);
            }
        } catch (error) {
            console.error('Error during login:', error);
            setShowLoader(false);
            setShowError(true);
        }
    }

    return (
        <div className="add-new-product">
            {showLoader && <span className='loader login__loader'></span>}
            <form className="add-new-product-form" onSubmit={handleSubmit}>
                <div className="my-account__form-fields">
                    <div className="input-wrapper">
                        <input 
                            type="text" 
                            className="form-input" 
                            placeholder="Product Name"
                            ref={productNameRef}
                            />
                    </div>
                    <div className="input-wrapper">
                        <input 
                            type="number" 
                            className="form-input" 
                            placeholder="Product Price"
                            ref={productPriceRef}
                            />
                    </div>
                    <div className="input-wrapper">
                        <input 
                            type="text" 
                            className="form-input" 
                            placeholder="Product Creator"
                            ref={productCreatorRef}
                            />
                    </div>
                    <div className="input-wrapper">
                        <input 
                            type="text" 
                            className="form-input" 
                            placeholder="Product Description"
                            ref={productDescriptionRef}
                            />
                    </div>
                    <div className="input-wrapper">
                        <input 
                            type="text" 
                            className="form-input" 
                            placeholder="Product Category"
                            ref={productCategoryRef}
                            />
                    </div>
                    <div className="input-wrapper">
                        <div className="register__radio-wrapper">
                            <p>Recommended:</p>
                            <div className="register__radio-wrapper-item">
                                <input 
                                    type="radio" 
                                    id="yes" 
                                    name="recommended" 
                                    value="yes"
                                    checked={recommended === 'yes'}
                                    onChange={(e) => setRecommended(e.target.value)}
                                    />
                                <label htmlFor="yes">Yes</label>
                            </div>
                            <div className="register__radio-wrapper-item">
                                <input 
                                    type="radio" 
                                    id="no" 
                                    name="recommended" 
                                    value="no"
                                    checked={recommended === 'no'}
                                    onChange={(e) => setRecommended(e.target.value)}
                                    />
                                <label htmlFor="no">No</label>
                            </div>
                        </div>
                    </div>
                    <div className="input-wrapper">
                        <input 
                            type="text" 
                            className="form-input" 
                            placeholder="Product Image"
                            ref={productImageRef}
                            />
                    </div>
                    {showError && <span className='form-message form-error login__error'>All fields must be correct!</span>}
                    {showSuccess && <span className='form-message form-success login__success'>New product is added!</span>}
                    <input className="my-account__form-submit add-new__form-submit" type="submit" value="Add Product" />
                </div>
            </form>
        </div>
    )
}