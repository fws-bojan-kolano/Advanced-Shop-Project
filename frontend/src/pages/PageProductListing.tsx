import Products from "../components/products/Products";
import Recommended from "../components/recommended/Recommended";

const PageProductListing = () => {

    return (
        <div className="product-page">
            <Products />
            <Recommended />
        </div>
    )
}

export default PageProductListing;