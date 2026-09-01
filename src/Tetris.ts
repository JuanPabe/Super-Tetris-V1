import { Board } from "./Board.js";
import { Clock } from "./Clock.js";

export class Tetris {
    private tablero: Board;
    private reloj: Clock;

    constructor() {
        this.tablero = new Board();
        this.reloj = new Clock();
    }
}
