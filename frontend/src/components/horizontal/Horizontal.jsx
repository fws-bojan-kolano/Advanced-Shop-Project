import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useEffect, useRef, useState } from "react";
import "./horizontal.scss";

gsap.registerPlugin(ScrollTrigger);

export default function Horizontal() {
    const panels = useRef([]);
    const panelsContainer = useRef();
    const [horizontalWidth, setHorizontalWidth] = useState(100);

    const createPanelsRefs = (panel, index) => {
        panels.current[index] = panel;
    };

    useEffect(() => {
        const setupGSAP = () => {
        const totalPanels = panels.current.length;

        if (totalPanels === 0 || !panelsContainer.current) return;


        setHorizontalWidth(totalPanels * 100);

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
            <div className="description panel blue" ref={(e) => createPanelsRefs(e, 0)}>
                <div className="horizontal__item">
                    <p>
                    Scroll vertically to scrub the horizontal animation. It also
                    dynamically snaps to the sections in an organic way based on the
                    velocity. The snapping occurs based on the natural ending position
                    after momentum is applied, not a simplistic "wherever it is when
                    the user stops".
                    </p>
                    <div className="horizontal__scroll-down">Scroll down<div className="horizontal__scroll-down-arrow"></div></div>
                </div>
            </div>
            <section className="panel red" ref={(e) => createPanelsRefs(e, 1)}>ONE</section>
            <section className="panel orange" ref={(e) => createPanelsRefs(e, 2)}>TWO</section>
            <section className="panel purple" ref={(e) => createPanelsRefs(e, 3)}>THREE</section>
            <section className="panel green" ref={(e) => createPanelsRefs(e, 4)}>FOUR</section>
            <section className="panel gray" ref={(e) => createPanelsRefs(e, 5)}>FIVE</section>
        </div>
    );
}
