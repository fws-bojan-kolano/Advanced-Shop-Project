import './recommended.scss';
import Slider from 'react-slick';

export default function Recommended() {
    const settings = {
        dots: true,
        infinite: true,
        speed: 500,
        slidesToShow: 3,
        slidesToScroll: 1,
    }

    return (
        <div className="recommended">
            <div className="container">
                <Slider {...settings}>
                    <div className="recommended__slide">slide 1</div>
                    <div className="recommended__slide">slide 2</div>
                    <div className="recommended__slide">slide 3</div>
                    <div className="recommended__slide">slide 4</div>
                </Slider>
            </div>
        </div>
    )
}