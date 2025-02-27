import './heroComic.scss';

export default function HeroComic() {
    return (
        <div className="hero-comic">
            <article className="hero-comic__comic">
                <div className="hero-comic__panel">
                    <p className="text top-left">Suddenly...</p>
                    <img src="../../src/assets/images/hero.png" alt="Hero" />
                    <p className="text bottom-right">...a wild hero appears</p>
                </div>
                <div className="hero-comic__panel">
                    <p className="text top-left">A book...</p>
                    <img src="../../src/assets/images/logo.png" alt="Book" />
                    <p className="text bottom-right">...or is it?</p>
                </div>
                <div className="hero-comic__panel">
                    <img src="../../src/assets/images/logo.png" alt="Book" />
                    <p className="speech">I am just an old book..</p>
                </div>
                <div className="hero-comic__panel">
                    <p className="text top-left">A sudden transformation?...</p>
                    <img src="../../src/assets/images/villain.png" alt="Villain" />
                </div>
                <div className="hero-comic__panel">
                    <p className="text top-left">The book...</p>
                    <img src="../../src/assets/images/logo.png" alt="Book" />
                    <p className="text bottom-right">...was not just a book</p>
                </div>
                <div className="hero-comic__panel">
                    <p className="text top-left">It was a prison...</p>
                    <img src="../../src/assets/images/logo.png" alt="Book" />
                </div>
                <div className="hero-comic__panel">
                    <img src="../../src/assets/images/villain.png" alt="Villain" />
                    <p className="text bottom-right">A prison for the most evil guy!</p>
                </div>
                <div className="hero-comic__panel">
                    <img src="../../src/assets/images/villain.png" alt="Villain" />
                    <p className="text bottom-right">An evil guy who wanted to destroy books!</p>
                </div>
                <div className="hero-comic__panel">
                    <p className="text top-left">But the hero was stronger...</p>
                    <img src="../../src/assets/images/hero.png" alt="Hero" />
                    <p className="text bottom-right">THE END</p>
                </div>
                </article>
            </div>
    )
}