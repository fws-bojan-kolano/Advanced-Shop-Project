import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useEffect, useRef } from "react";
import BasicText from "../basicText/BasicText";
import HeroComic from "../heroScrolling/HeroComic";
import "./horizontal.scss";

gsap.registerPlugin(ScrollTrigger);

export default function Horizontal() {
    const panels = useRef([]);
    const panelsContainer = useRef();

    const createPanelsRefs = (panel, index) => {
        panels.current[index] = panel;
    };

    useEffect(() => {
        const setupGSAP = () => {
            const totalPanels = panels.current.length;

            if (totalPanels === 0 || !panelsContainer.current) return;

            ScrollTrigger.getAll().forEach(st => {
                if (st.trigger === panelsContainer.current) {
                    st.kill();
                }
            });

            gsap.to(panels.current, {
                xPercent: -100 * (totalPanels - 1),
                ease: "none",
                scrollTrigger: {
                    trigger: panelsContainer.current,
                    pin: true,
                    scrub: 1,
                    snap: {
                        snapTo: 1 / (totalPanels - 1),
                        duration: { min: 0.2, max: 0.6 },
                        delay: 0.1,
                        ease: "power1.inOut"
                    },
                    end: () => "+=" + panelsContainer.current.offsetWidth,
                }
            });
        };

        const timeoutId = setTimeout(setupGSAP, 0);
        return () => {
            clearTimeout(timeoutId);
            ScrollTrigger.getAll().forEach(st => st.kill());
        };
    }, []);

    return (
        <div className="horizontal" ref={panelsContainer}>
            <div className="panel blue" ref={(e) => createPanelsRefs(e, 0)}>
                <div className="horizontal__item">
                    <p>Scroll vertically to scrub the horizontal animation. It also
                    dynamically snaps to the sections.</p>
                    <div className="horizontal__scroll-down">Scroll down<div className="horizontal__scroll-down-arrow"></div></div>
                </div>
            </div>
            <section className="panel red" ref={(e) => createPanelsRefs(e, 1)}><BasicText /></section>
            <section className="panel orange" ref={(e) => createPanelsRefs(e, 2)}><HeroComic /></section>
            <section className="panel purple" ref={(e) => createPanelsRefs(e, 3)}>KEEP SCROLLING!</section>
        </div>
    );
}
