import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from "gsap/ScrollTrigger";
import './reveal.scss';
import { Link } from 'react-router-dom';

gsap.registerPlugin(ScrollTrigger);

export default function Reveal() {
    const revealContainer = useRef()
    const leftBox = useRef();;
    const rightBox = useRef();

    useEffect(() => {
        const setupGSAP = () => {
            if(!revealContainer.current) return;

            ScrollTrigger.getAll().forEach(st => {
                if (st.trigger === revealContainer.current) {
                    st.kill();
                }
            });

            const tl = gsap.timeline({
                scrollTrigger: {
                    trigger: revealContainer.current,
                    start: "-500 center",
                    end: "bottom center",
                    scrub: true
                }
            });

            tl.to(leftBox.current, {
                xPercent: -150,
                skewX: 2,
                ease: "power2.out",
                duration: 2
            });

            const tr = gsap.timeline({
                scrollTrigger: {
                    trigger: revealContainer.current,
                    start: "-500 center",
                    end: "bottom center",
                    scrub: true
                }
            });

            tr.to(rightBox.current, {
                xPercent: 150,
                skewX: -2,
                ease: "power2.out",
                duration: 2
            });
        };

        const timeoutId = setTimeout(setupGSAP, 0);
        return () => {
            clearTimeout(timeoutId);
            ScrollTrigger.getAll().forEach(st => st.kill());
        };

    }, []);

    return (
        <div className='reveal' ref={revealContainer}>
            <div className="container">
                <div className="reveal__content">
                    <div className="reveal__box reveal__box--left" ref={leftBox}></div>
                    <div className="reveal__box reveal__box--middle">SCROLL <br/>DOWN <br/>TO <br/>THE <br/>NEXT <br/>SECTION!</div>
                    <div className="reveal__box reveal__box--right" ref={rightBox}></div>
                </div>
            </div>
        </div>
    );
}
