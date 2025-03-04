import './addNewProduct.scss';
import { useRef } from 'react';

export default function AddNewProduct() {

    const productNameRef = useRef(null);
    const productPriceRef = useRef(null);
    const productCreatorRef = useRef(null);
    const productDescriptionRef = useRef(null)
    const productImageRef = useRef(null);

    const handleSubmit = (event) => {
        event.preventDefault();

        const recommended = document.querySelector('input[name=recommended]:checked').value;
        console.log(recommended);
    }

    return (
        <div className="add-new-product">
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
                        <div className="register__radio-wrapper">
                            <p>Recommended:</p>
                            <div className="register__radio-wrapper-item">
                                <input 
                                    type="radio" 
                                    id="yes" 
                                    name="recommended" 
                                    value="yes"
                                    checked
                                    />
                                <label htmlFor="yes">Yes</label>
                            </div>
                            <div className="register__radio-wrapper-item">
                                <input 
                                    type="radio" 
                                    id="no" 
                                    name="recommended" 
                                    value="no"
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
                    <input className="my-account__form-submit add-new__form-submit" type="submit" value="Add Product" />
                </div>
            </form>
        </div>
    )
}