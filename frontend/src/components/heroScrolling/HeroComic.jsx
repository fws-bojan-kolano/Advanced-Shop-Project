import './heroComic.scss';

export default function HeroComic() {
    return (
        <div className="hero-comic">
            <article class="comic">
                <div class="panel">
                    <p class="text top-left">Suddenly...</p>
                    <p class="text bottom-right">...something amazing happened</p>
                </div>
                <div class="panel">
                    <p class="text top-left">Try resizing...</p>
                    <p class="text bottom-right">...it's responsive</p>
                </div>
                <div class="panel">
                    <p class="speech">A speech bubble</p>
                </div>
                <div class="panel"></div>
                <div class="panel"></div>
                <div class="panel"></div>
                <div class="panel"></div>
                <div class="panel"></div>
                <div class="panel">
                    <p class="text bottom-right">THE END</p>
                </div>
                </article>
            </div>
    )
}