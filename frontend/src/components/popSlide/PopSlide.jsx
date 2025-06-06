import { useRef, useState } from 'react';
import gsap from 'gsap';
import './popSlide.scss';

const offset = 20;

export default function PopSlide() {
    const sliderRef = useRef(null);
    const [items, setItems] = useState([
        { text: 'Click Here!', color: '#FF6B6B' },
        { text: 'Click Again!', color: '#6BCB77' },
        { text: 'Woah! It keeps going!', color: '#4D96FF' },
        { text: 'Cool Right?', color: '#FFD93D' },
        { text: 'Keep Clicking!', color: '#9D4EDD' },
    ]);
    const [isAnimating, setIsAnimating] = useState(false);

    const moveCard = () => {
        if (isAnimating || !sliderRef.current) return;
        setIsAnimating(true);

        const currentItems = sliderRef.current.children;
        const firstEl = currentItems[0];

        gsap.to(firstEl, {
            opacity: 0,
            y: 100,
            duration: 0.4,
            ease: "power2.out",
            onComplete: () => {
                sliderRef.current.appendChild(firstEl);

                gsap.set(firstEl, {
                    opacity: 0,
                    y: -40,
                    left: `${(items.length - 1) * offset}px`,
                    top: `${-(items.length - 1) * offset}px`,
                    zIndex: 0,
                    ease: "power2.out",
                });

                for (let i = 0; i < items.length; i++) {
                    const el = currentItems[i];
                    gsap.to(el, {
                        left: `${i * offset}px`,
                        top: `${-i * offset}px`,
                        zIndex: items.length - i,
                        duration: 0.8,
                        ease: "bounce.out",
                    });
                }

                gsap.to(firstEl, {
                    opacity: 0.9,
                    y: 0,
                    duration: 0.4,
                    ease: "power2.out",
                    onComplete: () => {
                        setItems(prev => [...prev.slice(1), prev[0]]);
                        setIsAnimating(false);
                    }
                });
            }
        });
    };

    return (
        <div className='pop-slide'>
            <div className="container">
                <div className="row pop-slide__content">
                    <div className="col-xl-6 col-lg-6 col-md-12">
                        <p className="pop-slide__left-text">Click on <strong>any</strong> box to move the first card to the back!</p>
                    </div>
                    <div className="col-xl-6 col-lg-6 col-md-12">
                        <ul className="pop-slide__slider" ref={sliderRef}>
                            {items.map((item, index) => (
                                <li
                                    className="pop-slide__item"
                                    key={item.text}
                                    onClick={() => !isAnimating && moveCard()}
                                    style={{
                                        left: `${index * offset}px`,
                                        top: `${-index * offset}px`,
                                        zIndex: items.length - index,
                                        cursor: isAnimating ? 'default' : 'pointer',
                                        background: item.color,
                                    }}
                                >
                                    <span className="pop-slide__item-text">{item.text}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
}
