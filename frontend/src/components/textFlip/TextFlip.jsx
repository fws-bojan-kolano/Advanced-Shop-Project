import './textFlip.scss';

export default function TextFlip () {
    return (
        <div className="text-flip">
            <div className="container">
                <div className="text-flip__wrapper">
                    <span className="text-flip__top">Read</span>
                    <div className="text-flip__flips">
                        <div><div className="text-flip__item">Adventure</div></div>
                        <div><div className="text-flip__item">Horror</div></div>
                        <div><div className="text-flip__item">Romance</div></div>
                    </div>
                    <span className="text-flip__bottom">Stories!</span>
                </div>
            </div>
        </div>
    )
}