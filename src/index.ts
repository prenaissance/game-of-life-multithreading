import Task from "./common/Task/Task";
import "./style.scss";

const container = document.querySelector(".grid-container")!;
const canvas: HTMLCanvasElement = document.querySelector("#canvas")!;
const ctx = canvas.getContext("2d", { alpha: true })!;

//mutate DOM after canvas creation, some events depend on the context being initialized.
const main = async () => {
    Task.config.maxWorkers = 16;

    const start = performance.now();

    const otherTasks = Array(50).fill(1).map(() => {
        return new Task(() => {
            function fibonacci(n: number): number {
                if (n <= 1) {
                    return 1;
                }
                return fibonacci(n - 1) + fibonacci(n - 2);
            };
            const result = fibonacci(37);
            return (result);
        });
    });

    otherTasks.forEach(task => task.start());
    await Task.whenAll(...otherTasks);

    const end = performance.now();
    console.log(end - start);

    const start2 = performance.now();

    Array(50).fill(1).map(() => {
        function fibonacci(n: number): number {
            if (n <= 1) {
                return 1;
            }
            return fibonacci(n - 1) + fibonacci(n - 2);
        };
        const result = fibonacci(37);
    });

    otherTasks.forEach(task => task.start());
    await Task.whenAll(...otherTasks);

    const end2 = performance.now();

    console.log(end2 - start2);

};

main();
