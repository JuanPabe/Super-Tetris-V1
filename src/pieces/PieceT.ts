import { PieceBase } from "./PieceBase.js";

export class PieceT extends PieceBase {
    constructor() {
        super("T", [
            [false, true, false],
            [true, true, true],
        ]);
    }
}