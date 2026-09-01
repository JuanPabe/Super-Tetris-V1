import { PieceBase } from "./PieceBase.js";

export class PieceStick extends PieceBase {
    constructor() {
        super("Stick", [
            [true],
            [true],
            [true],
            [true],
        ]);
    }
}