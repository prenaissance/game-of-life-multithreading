import { INextFrameStrategy } from "./interfaces/INextFrameStrategy";
import NextFrameStrategy from "./NextFrameStrategy";

class GameOfLife {
    private _matrix: boolean[][];
    private _animationFrame: any;
    nextFrame: INextFrameStrategy = new NextFrameStrategy();

    constructor(private readonly _ctx: CanvasRenderingContext2D, xw: number, yh: number) {
        this._matrix = new Array(yh)
            .fill([]).map(() => (
                new Array(xw).fill(false).map(() => Math.random() < 0.3)
            ));

        this.start();
    }

    render() {
        const { height, width } = this._ctx.canvas;
        const xSize = width / this._matrix[0]?.length || 1;
        const ySize = height / this._matrix.length || 1;
        this._matrix.forEach((row, y) => {
            row.forEach((pixel, x) => {
                this._ctx.fillStyle = pixel ? "#fff" : "#000";
                this._ctx.fillRect(x * xSize, y * ySize, xSize, ySize);
            });
        });
    }

    async start() {
        this._animationFrame = setInterval(async () => {
            this.render();
            this._matrix = await this.nextFrame.execute(this._matrix);
        }, 300);
    }

    pause() {
        clearTimeout(this._animationFrame);
    }
}

export default GameOfLife;