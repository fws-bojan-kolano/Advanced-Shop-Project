import HeroBanner from "../components/heroBanner/HeroBanner";
import BookFlip from "../components/bookFlip/BookFlip";
import BasicText from "../components/basicText/BasicText";
import Products from "../components/products/Products";

const PageHome = () => {
    return (
        <>
            <HeroBanner />
            <BookFlip />
            <Products />
            <BasicText />
        </>
    )
}

export default PageHome;