interface INextFrameStrategy {
    execute(matrix: boolean[][]): Promise<boolean[][]>;
}

export type { INextFrameStrategy };