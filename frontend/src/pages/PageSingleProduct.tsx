import Recommended from '../components/recommended/Recommended';
import SingleProduct from '../components/singleProduct/SingleProduct';
import Gallery from "../components/gallery/Gallery";
import BasicText from "../components/basicText/BasicText";

const PageSingleProduct = () => {

    return (
        <div className="product-page">
            <SingleProduct />
            <Gallery />
            <BasicText />
            <Recommended />
        </div>
    )
}

export default PageSingleProduct;