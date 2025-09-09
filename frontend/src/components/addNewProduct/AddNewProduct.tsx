import { SERVER } from '../../utils/utils';
import './addNewProduct.scss';
import { useState } from 'react';
import { useUser } from '../user/user-context';
import type { Product } from '../../interfaces/Product';

export default function AddNewProduct() {
    const [showLoader, setShowLoader] = useState(false);
    const [showError, setShowError] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);
    const [recommended, setRecommended] = useState('yes');
    const {setProductsMegamenu} = useUser();

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>): Promise<void> => {
        event.preventDefault();
        setShowLoader(true);

        const formData = new FormData(event.currentTarget);
        const newProduct: Product = {
            name: formData.get('name') as string,
            price: Number(formData.get('price') as string),
            creator: formData.get('creator') as string,
            description: formData.get('description') as string,
            image: formData.get('image') as string,
            recommended: recommended as 'yes' | 'no',
            category: formData.get('category') as string
        }

        try {
            const response = await fetch(`${SERVER}products/new`, {
                method: "POST",
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify(newProduct),
            });

            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

            const result = await response.json();
            if (result.success) {
                setShowLoader(false);
                setShowError(false);
                setShowSuccess(true);

                const updatedProducts = await fetch(`${SERVER}products`).then(res => res.json());
                setProductsMegamenu(updatedProducts);

                // Reset form fields
                event.currentTarget.reset();
            } else {
                setShowLoader(false);
                setShowError(true);
            }
        } catch (error) {
            console.error('Error adding product:', error);
            setShowLoader(false);
            setShowError(true);
        } finally {
            setShowLoader(false);
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
                            name="name"
                            />
                    </div>
                    <div className="input-wrapper">
                        <input 
                            type="number" 
                            className="form-input" 
                            placeholder="Product Price"
                            name="price"
                            />
                    </div>
                    <div className="input-wrapper">
                        <input 
                            type="text" 
                            className="form-input" 
                            placeholder="Product Creator"
                            name="creator"
                            />
                    </div>
                    <div className="input-wrapper">
                        <input 
                            type="text" 
                            className="form-input" 
                            placeholder="Product Description"
                            name="description"
                            />
                    </div>
                    <div className="input-wrapper">
                        <input 
                            type="text" 
                            className="form-input" 
                            placeholder="Product Category"
                            name="category"
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
                                    onChange={(e) => setRecommended('yes')}
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
                                    onChange={(e) => setRecommended('no')}
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
                            name="image"
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