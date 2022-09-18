import Task from "./common/Task/Task";
import "./style.scss";

const container = document.querySelector(".grid-container")!;
const canvas: HTMLCanvasElement = document.querySelector("#canvas")!;
const ctx = canvas.getContext("2d", { alpha: true })!;

//mutate DOM after canvas creation, some events depend on the context being initialized.
const i = 1;
const main = async () => {

    const response = await Task.run(() => {
        try {
            return i + 2;
        }
        catch {
            return 10;
        }
    }, { i });

    const otherTasks = Array(2).fill(1).map(() => {
        return new Task(() => {
            try {
                return i + 2;
            }
            catch {
                return 10;
            }
        });
    });

    const completed = await Task.whenAll(...otherTasks);
    console.log(completed.map(task => task.result));

};

main();
