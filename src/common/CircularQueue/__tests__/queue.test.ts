import { describe, test, expect, beforeEach } from "@jest/globals";
import CircularQueue from "../CircularQueue";

describe("circular queue", () => {
    let queue = new CircularQueue<number>();

    beforeEach(() => {
        queue = new CircularQueue<number>();
    });

    test("should add elements", () => {
        queue.push(1);
        queue.push(3);
        queue.push(4);
    });

    test("should remove elements", () => {
        queue.push(3);
        queue.push(14);
        queue.push(2);

        queue.pop();
        queue.pop();
        queue.pop();
        expect(queue.pop()).toBeNull();
    });

    test("should count length correctly", () => {
        queue.push(3);
        queue.push(14);
        expect(queue.length).toBe(2);

        queue.push(2);
        expect(queue.length).toBe(3);

        queue.pop();
        queue.pop();
        expect(queue.length).toBe(1);
    });

    test("should iterate correctly", () => {
        queue.push(3);
        queue.push(14);
        queue.push(2);

        queue.pop();

        queue.push(44);

        expect([...queue]).toEqual([14, 2, 44]);
    });

    test("should iterate empty queue", () => {
        expect([...queue]).toEqual([]);
    });
});