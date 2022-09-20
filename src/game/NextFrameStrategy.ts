import { INextFrameStrategy } from "./interfaces/INextFrameStrategy";
import { neighborOffsets } from "./utils/consts";

const inMatrix = (width: number, height: number, x: number, y: number) => {
    return x >= 0 && x < width && y >= 0 && y < height;
};

class NextFrameStrategy implements INextFrameStrategy {
    execute(matrix: boolean[][]): Promise<boolean[][]> {
        return new Promise((resolve) => {
            const height = matrix.length;
            const width = matrix[0]?.length || 0;
            const newMatrix: boolean[][] = new Array(height)
                .fill([])
                .map(() => new Array(width).fill(false));

            matrix.forEach((row, y) => {
                row.forEach((_, x) => {
                    const neighbors = neighborOffsets
                        .map(([ny, nx]) => [y + ny, x + nx])
                        .filter(([ny, nx]) => inMatrix(width, height, nx, ny))
                        .map(([ny, nx]) => matrix[ny][nx]);
                    const neighborCount = neighbors
                        .reduce((sum, value) => {
                            return sum + +value;
                        }, 0);

                    if ((matrix[y][x] && neighborCount === 2) || neighborCount === 3) {
                        newMatrix[y][x] = true;
                    }
                });
            });

            resolve(newMatrix);
        });
    }
}

export default NextFrameStrategy;