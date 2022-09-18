interface WorkerContext extends WindowOrWorkerGlobalScope, Record<string, any> { }

type WorkerMessage = {
    fnString: string;
    ctx: Record<string, any>;
};

type WorkerResponse<T> = {
    response: T;
};
const context: WorkerContext = self;

onmessage = function (e) {
    const event = e as MessageEvent<WorkerMessage>;
    const { fnString, ctx } = event.data;
    for (const [key, value] of Object.entries(ctx)) {
        context[key] = value;
    }
    const fn = eval(fnString);
    if (typeof fn !== "function") {
        throw new Error("argument 'fn' must be a function!");
    }
    const response = fn();
    postMessage({ response });
};