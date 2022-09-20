import GameOfLife from "./game/GameOfLife";
import { INextFrameStrategy } from "./game/interfaces/INextFrameStrategy";
import NextFrameMultiprocessingStrategy from "./game/NextFrameMultiprocessingStrategy";
import NextFrameStrategy from "./game/NextFrameStrategy";
import { countFps } from "./game/utils/misc";
import "./style.scss";

const container = document.querySelector(".grid-container")!;
const canvas: HTMLCanvasElement = document.querySelector("#canvas")!;
canvas.height = canvas.offsetHeight;
canvas.width = canvas.offsetWidth;
const ctx = canvas.getContext("2d", { alpha: true })!;

//mutate DOM after canvas creation, some events depend on the context being initialized.
const gameOfLife = new GameOfLife(ctx, 150, 150);

const pauseButton = document.querySelector("#pause")!;

pauseButton.addEventListener("click", () => {
    gameOfLife.pause();
});

const playButton = document.querySelector("#play")!;

playButton.addEventListener("click", () => {
    gameOfLife.start();
});

let multiprocessingEnabled = false;
const multiprocessingButton: HTMLButtonElement = document.querySelector("#multiprocessing")!;

multiprocessingButton.addEventListener("click", () => {
    multiprocessingEnabled = !multiprocessingEnabled;
    multiprocessingButton.innerText = `Multiprocessing: ${multiprocessingEnabled ? "on" : "off"}`;
    const strategy: INextFrameStrategy = multiprocessingEnabled
        ? new NextFrameMultiprocessingStrategy()
        : new NextFrameStrategy();

    gameOfLife.nextFrame = strategy;
});

const fpsText: HTMLParagraphElement = document.querySelector("#fps>p")!;
gameOfLife.frameRateCounter.subscribe(fpsText);
