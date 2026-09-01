import { PieceBase } from "./PieceBase.js";

export class PieceL extends PieceBase {
    constructor() {
        super("L", [
            [true, false],
            [true, false],
            [true, true],
        ]);
    }
}