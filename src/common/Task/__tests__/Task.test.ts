import { describe, test, expect, beforeEach } from "@jest/globals";
import Task from "../Task";

// does not work with transpiling to commonjs modules :/
describe("Task", () => {

    test.skip("create and complete function without context", async () => {
        const task = new Task(() => {
            return "asdf";
        });
        expect(task.result).resolves.toBe("asdf");

        const result = await Task.run(() => {
            return 7;
        });
        expect(result).toBe(7);
    });

});