import './bookFlip.scss';

export default function BookFlip() {
    return (
        <div className="book-flip">
            <div className="container">
                <div className="row book-flip__content">
                    <div className="col-xl-6 col-lg-6 col-md-12 col-sm-12 book-flip__left">
                        <p className="book-flip__text">It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has</p>
                        <span className="book-flip__span">Try hovering the book! <i className="fa-solid fa-arrow-right book-flip__icon"></i></span>
                    </div>
                    <div className="col-xl-6 col-lg-6 col-md-12 col-sm-12 book-flip__right">
                        <div className="card">
                            <div className="img-box">
                                <div className="bark"></div>
                                <img src="https://image.ibb.co/fYzTrb/lastofus.jpg" />
                            </div>
                            <div className="details">
                                <h3 className="details__title details__title--green">SURPRISE!</h3>
                                <h3 className="details__title details__title--red details__title--margin">You didn't see this coming!</h3>
                                <p>Dear viewer,</p>
                                <p>Let's see...</p>
                                <p>You have scrolled this far,</p>
                                <p>You like books,</p>
                                <p>You also seem to like programming.</p>
                                <p>Do you have a favourite book?</p>
                                <p>I do.</p>
                                <p>But, I'm not gonna tell you!</p>
                                <p className="details__bottom-text">Why?</p>
                                <p className="details__bottom-text">Cuz I can! XOXO</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}