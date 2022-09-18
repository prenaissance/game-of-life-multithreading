import { resolve } from "path";
import Queue from "../CircularQueue/CircularQueue";

type TaskConfig = {
    maxWorkers: number;
};

class Task<T>{
    private static _queue = new Queue<Task<unknown>>();
    private static _freeWorkers: Array<Worker> = [];
    private static _busyWorkers: Array<Worker> = [];
    // setting config completely overrides, should be changed to mixin
    static config: TaskConfig = { maxWorkers: navigator.hardwareConcurrency };

    private _isRunning = false;
    private _result: T | null = null;
    private _resolve?: (value: T) => void;
    private _reject?: (reason?: any) => void;

    get result() {
        this.wait();
        return this._result!;
    }

    constructor(private readonly _fn: () => T, private readonly _ctx: Record<string, any> = {}) { }

    // only call when the worker finished his task
    private startNext(worker: Worker) {
        if (Task._queue.empty()) {
            const freedIndex = Task._busyWorkers.findIndex(x => x === worker);
            delete Task._busyWorkers[freedIndex];
            Task._freeWorkers.push(worker);
            return;
        }

        const nextTask = Task._queue.pop()!;
        nextTask.registerWorker(worker);
    }

    private registerWorker(worker: Worker) {
        const handleResponse = (e: MessageEvent<any>) => {
            const event = e as MessageEvent<WorkerResponse<T>>;
            this._resolve!(event.data.response);
            this.startNext(worker);
        };

        const handleError = (e: ErrorEvent) => {
            this._reject!(e.error);
            this.startNext(worker);
        };

        worker.removeEventListener("message", handleResponse);
        worker.removeEventListener("error", handleError);

        worker.addEventListener("message", handleResponse);
        worker.addEventListener("error", handleError);

        worker.postMessage({ fnString: this._fn.toString(), ctx: this._ctx });
    }


    start() {
        const promise = new Promise<T>((resolve, reject) => {
            resolve = this._resolve as typeof resolve || resolve;
            reject = this._reject || reject;

            this._resolve = resolve;
            this._reject = reject;
        });

        if (this._result || this._isRunning) {
            return promise;
        }

        this._isRunning = true;

        if (Task._freeWorkers.length) {
            const worker = Task._freeWorkers.pop()!;
            this.registerWorker(worker);
        }
        else if (Task._busyWorkers.length === Task.config.maxWorkers) {
            Task._queue.push(this as Task<unknown>);
            return;
        }
        else {
            const worker = new Worker(new URL("./worker.ts", import.meta.url));
            Task._busyWorkers.push(worker);
            this.registerWorker(worker);
        }
        return promise;
    }

    wait() {
        if (this._result) {
            return this._result;
        }
        this.start();
        // Completely blocks main thread
        // will cause major problems if called with falsy response
        while (!this._result) { }
        return this._result;
    }

    static run<T>(fn: () => T, ctx: Record<string, any> = {}) {
        const task = new Task(fn, ctx);
        return task.start();
    }

    static async whenAll<T>(...tasks: Task<T>[]) {
        await Promise.all(tasks.map(task => task.start()));
        return tasks;
    }

    static async whenAny<T>(...tasks: Task<T>[]) {
        return Promise.race(tasks.map(task => task.start()));
    }
}

export default Task;