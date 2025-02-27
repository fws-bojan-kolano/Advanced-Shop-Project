import HeroBanner from "../components/heroBanner/HeroBanner";
import BookFlip from "../components/bookFlip/BookFlip";
import BasicText from "../components/basicText/BasicText";
import TextFlip from "../components/textFlip/TextFlip";
import Products from "../components/products/Products";
import Gallery from "../components/gallery/Gallery";

const PageHome = () => {
    return (
        <>
            <HeroBanner />
            <BookFlip />
            <Products />
            <TextFlip />
            <BasicText />
            <Gallery />
        </>
    )
}

export default PageHome;