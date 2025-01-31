import Product from "../product/Product";
import './products.scss';

export default function Products() {
    return (
        <div className="products">
            <div className="container">
                <div className="row products__wrapper">
                    <Product></Product>
                    <Product></Product>
                    <Product></Product>
                    <Product></Product>
                    <Product></Product>
                    <Product></Product>
                </div>
            </div>
        </div>
    )
}