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
    private _promise: Promise<T>;
    private _handleResponse: (e: MessageEvent<any>) => void;
    private _handleError: (err: any) => void;

    get result() {
        return this._promise;
    }

    constructor(private readonly _fn: () => T, private readonly _ctx: Record<string, any> = {}) {
        const promise = new Promise<T>((resolve, reject) => {
            this._handleResponse = (e: MessageEvent<any>) => {
                const event = e as MessageEvent<WorkerResponse<T>>;
                resolve(event.data.response);
            };

            this._handleError = (e: ErrorEvent) => {
                reject(e.error);
            };
        });
        this._promise = promise;
    }

    // only call when the worker finished his task
    private static startNext(worker: Worker) {
        const freedIndex = Task._busyWorkers.findIndex(x => x === worker);
        Task._busyWorkers.splice(freedIndex, 1);

        if (Task._queue.empty()) {
            this._freeWorkers.push(worker);
            return;
        }

        const nextTask = Task._queue.pop()!;
        nextTask.registerWorker(worker);
    }

    private registerWorker(worker: Worker) {
        worker.onmessage = this._handleResponse;
        worker.onerror = this._handleError;

        worker.postMessage({ fnString: this._fn.toString(), ctx: this._ctx });
        Task._busyWorkers.push(worker);

        this._promise.finally(() => {
            Task.startNext(worker);
        });
    }

    start() {
        if (this._result || this._isRunning) {
            return this._promise;
        }

        this._isRunning = true;

        if (Task._freeWorkers.length) {
            const worker = Task._freeWorkers.pop()!;
            this.registerWorker(worker);
        }
        else if (Task._freeWorkers.length + Task._busyWorkers.length < Task.config.maxWorkers) {
            const worker = new Worker(new URL("./worker.ts", import.meta.url));
            this.registerWorker(worker);
        }
        else {
            Task._queue.push(this as Task<unknown>);
        }
        return this._promise;
    }

    static run<T>(fn: () => T, ctx: Record<string, any> = {}) {
        const task = new Task(fn, ctx);
        return task.start()!;
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