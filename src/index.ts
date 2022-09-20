import Task from "./common/Task/Task";
import GameOfLife from "./game/GameOfLife";
import "./style.scss";

const container = document.querySelector(".grid-container")!;
const canvas: HTMLCanvasElement = document.querySelector("#canvas")!;
canvas.height = canvas.offsetHeight;
canvas.width = canvas.offsetWidth;
const ctx = canvas.getContext("2d", { alpha: true })!;

//mutate DOM after canvas creation, some events depend on the context being initialized.
const gameOfLife = new GameOfLife(ctx, 100, 100);

const pauseButton = document.querySelector("#pause")!;

pauseButton.addEventListener("click", () => {
    gameOfLife.pause();
});

const playButton = document.querySelector("#play")!;

playButton.addEventListener("click", () => {
    gameOfLife.start();
});
