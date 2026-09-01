import { PieceBase } from "./PieceBase.js";

export class PieceLRight extends PieceBase {
    constructor() {
        super("LRight", [
            [false, true],
            [false, true],
            [true, true],
        ]);
    }
}