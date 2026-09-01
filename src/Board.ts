import { PieceBase } from "./pieces/PieceBase.js";

export class Board {
    private readonly width: number = 10;
    private readonly height: number = 20;
    private grid: boolean[][];
    private pieces: PieceBase[];
    private currentPiece: PieceBase | null;
    private _lineCount: number;

    constructor(width: number = 10, height: number = 20) {
        this.width = width;
        this.height = height;
        this.grid = Array.from({ length: height }, () => Array(width).fill(false));
        this.pieces = [];
        this.currentPiece = null;
        this._lineCount = 0;
    }
}
