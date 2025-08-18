import './gallery.scss';

export default function Gallery() {
    return (
        <div className="gallery">
            <div className="container">
                <h2 className="section-title gallery__title">Gallery</h2>
                <div className="gallery__wrap">
                    <div className="gallery__item"></div>
                    <div className="gallery__item"></div>
                    <div className="gallery__item"></div>
                    <div className="gallery__item"></div>
                    <div className="gallery__item"></div>
                </div>
            </div>
        </div>
    )
}