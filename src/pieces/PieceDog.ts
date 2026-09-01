import { PieceBase} from "./PieceBase.js";

export class PieceDog extends PieceBase {
    constructor() {
        super("Dog",[
          [false, true, true ],
          [true,  true, false],
        ]);
    }
}