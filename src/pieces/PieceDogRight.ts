import { PieceBase} from "./PieceBase.js";

export class PieceDogRight extends PieceBase {
    constructor() {
        super("DogRight",[
         [true,  true, false],
         [false, true, true ],
        ]);
    }
}