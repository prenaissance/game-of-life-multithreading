import Task from "../common/Task/Task";
import { INextFrameStrategy } from "./interfaces/INextFrameStrategy";
// needs to be redefined, didn't add imports to task
const neighborOffsets = [
    [-1, -1],
    [-1, 0],
    [-1, 1],
    [0, 1],
    [1, 1],
    [1, 0],
    [1, -1],
    [0, -1]
];

class NextFrameMultiprocessingStrategy implements INextFrameStrategy {
    async execute(matrix: boolean[][]): Promise<boolean[][]> {

        const width = matrix[0].length;
        const height = matrix.length;

        const tasks = matrix.map((_, y) => {
            const matrixSlice = [-1, 0, 1].map((sliceY) => {
                const rowInRange = sliceY + y >= 0 && sliceY + y < height;
                return rowInRange ? matrix[sliceY + y] : new Array(width).fill(false);
            });

            return new Task(() => {

                const y = 1;
                const inMatrix = (width: number, height: number, x: number, y: number) => {
                    return x >= 0 && x < width && y >= 0 && y < height;
                };

                const row = matrixSlice[y];
                const newRow = Array<boolean>(width).fill(false);

                row.forEach((_, x) => {
                    const neighbors = neighborOffsets
                        .map(([ny, nx]) => [y + ny, x + nx])
                        .filter(([ny, nx]) => inMatrix(width, height, nx, ny))
                        .map(([ny, nx]) => matrixSlice[ny][nx]);
                    const neighborCount = neighbors
                        .reduce((sum, value) => {
                            return sum + +value;
                        }, 0);

                    if ((matrixSlice[y][x] && neighborCount === 2) || neighborCount === 3) {
                        newRow[x] = true;
                    }
                });

                return newRow;
            }, { matrixSlice, width, neighborOffsets, height })
        });

        tasks.forEach((task) => task.start());
        await Task.whenAll(...tasks);
        const newMatrix: boolean[][] = [];
        for await (const result of tasks.map(task => task.result)) {
            newMatrix.push(result!);
        }

        return newMatrix;
    }
}

export default NextFrameMultiprocessingStrategy;