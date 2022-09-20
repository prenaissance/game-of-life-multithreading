class FrameRateCounter {
    private _frames = 0;
    private _element?: HTMLElement;

    constructor() {
        setInterval(() => {
            if (this._element) {
                this._element.innerText = this._frames.toString();
            }
            this._frames = 0;
        }, 1000);
    }

    subscribe(element: HTMLElement) {
        this._element = element;
    }

    addFrame() {
        this._frames++;
    }

}

export default FrameRateCounter;