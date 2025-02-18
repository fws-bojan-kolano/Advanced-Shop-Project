import './product.scss';

export default function Product() {
    return (
        <div className="col-xl-6 col-lg-6 col-md-12 product">
            <div className="product__wrapper">
                <figure className="book">
                    <ul className="hardcover-front">
                        <li>
                            <img src="https://tympanus.net/Development/AnimatedBooks/img/cover.jpg" alt="" width="100%" height="100%" />
                        </li>
                        <li></li>
                    </ul>
                    <ul className="page">
                        <li></li>
                        <li>
                            <a className="book__btn" href="#">See More</a>
                        </li>
                        <li></li>
                        <li></li>
                        <li></li>
                    </ul>
                    <ul className="hardcover-back">
                        <li></li>
                        <li></li>
                    </ul>
                    <ul className="book-spine">
                        <li></li>
                        <li></li>
                    </ul>
                    <figcaption className="figcaption">
                        <h2 className="figcaption__title">Papelucho Perdido</h2>
                        <span className="figcaption__sub-title">By Marcela Paz</span>
                        <p className="figcaption__text">Fennel bamboo shoot pea sprouts rutabaga parsnip green bean gram wattle seed lentil horseradish nori. Grape lettuce turnip greens.</p>
                        <span className="figcaption__price">Price: $50</span>
                    </figcaption>
                </figure>
            </div>
        </div>
    )
}