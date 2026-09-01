import { PieceBase } from "./PieceBase.js";

export class PieceSquare extends PieceBase {
    constructor() {
        super("Square", [
            [true, true],
            [true, true],
        ]);
    }
}