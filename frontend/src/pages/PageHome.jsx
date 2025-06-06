import HeroBanner from "../components/heroBanner/HeroBanner";
import BookFlip from "../components/bookFlip/BookFlip";
import BasicText from "../components/basicText/BasicText";
import TextFlip from "../components/textFlip/TextFlip";
import Gallery from "../components/gallery/Gallery";
import Map from "../components/map/Map";
import PopSlide from "../components/popSlide/PopSlide";
import Horizontal from "../components/horizontal/Horizontal";

const PageHome = () => {
    return (
        <>
            <HeroBanner />
            <BookFlip />
            <TextFlip />
            <BasicText />
            <PopSlide />
            <Horizontal />
            <Gallery />
            <Map />
        </>
    )
}

export default PageHome;