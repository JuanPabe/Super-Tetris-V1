import { Board } from "./Board.js";
import { Clock } from "./Clock.js";
import { PieceBase } from "./pieces/PieceBase.js";
import { PieceT } from "./pieces/PieceT.js";
import { PieceSquare } from "./pieces/PieceSquare.js";
import { PieceStick } from "./pieces/PieceStick.js";
import { PieceL } from "./pieces/PieceL.js";
import { PieceLRight } from "./pieces/PieceLRight.js";
import { PieceDog } from "./pieces/PieceDog.js";
import { PieceDogRight } from "./pieces/PieceDogRight.js";

export class Tetris {
    private tablero: Board;
    private reloj: Clock;
    private _estado: "detenido" | "jugando" | "finalizado";
    private lineasObjetivo: number;
    private enCurso: boolean = false;

    constructor(lineasObjetivo: number = 5) {
        this.tablero = new Board();
        this.reloj = new Clock();
        this._estado = "detenido";
        this.lineasObjetivo = lineasObjetivo;
        this.enCurso = false;
    }

    get estado(): "detenido" | "jugando" | "finalizado" {
        return this._estado;
    }

    get obtTablero(): Board {
        return this.tablero;
    }

    get obtReloj(): Clock {
        return this.reloj;
    }

    get cantidadLineas(): number {
        return this.tablero.cantidadLineas;
    }

    get isEnCurso(): boolean {
        return this.enCurso || this._estado === "jugando";
    }

    comenzar(): void {
        this._estado = "jugando";
        this.enCurso = true;
        this.generarYAgregarPieza();
    }

    start(primeraPieza: PieceBase): void {
        this._estado = "jugando";
        this.enCurso = true;
        this.tablero.agregarPieza(primeraPieza);
    }

    tick(): boolean {
        if (this._estado !== "jugando" && !this.enCurso) return false;

        this._estado = "jugando";
        this.enCurso = true;
        this.reloj.avanzar();

        if (!this.tablero.piezaActual) {
            const agregada = this.generarYAgregarPieza();
            if (!agregada) {
                this._estado = "finalizado";
                this.enCurso = false;
                return false;
            }
        } else {
            const seMovio = this.tablero.moverAbajo();
            if (!seMovio) {
                if (this.tablero.cantidadLineas >= this.lineasObjetivo || this.tablero.esGameOver()) {
                    this._estado = "finalizado";
                    this.enCurso = false;
                    return false;
                }
                this.generarYAgregarPieza();
            }
        }

        if (this.tablero.cantidadLineas >= this.lineasObjetivo || this.tablero.esGameOver()) {
            this._estado = "finalizado";
            this.enCurso = false;
            return false;
        }

        return this._estado === "jugando";
    }

    rotarIzquierda(): boolean {
        if (this._estado !== "jugando" && !this.enCurso) return false;
        return this.tablero.rotarPiezaActual("izquierda");
    }

    rotarDerecha(): boolean {
        if (this._estado !== "jugando" && !this.enCurso) return false;
        return this.tablero.rotarPiezaActual("derecha");
    }

    private generarYAgregarPieza(): boolean {
        const fabricas: (() => PieceBase)[] = [
            () => new PieceT(),
            () => new PieceSquare(),
            () => new PieceStick(),
            () => new PieceL(),
            () => new PieceLRight(),
            () => new PieceDog(),
            () => new PieceDogRight(),
        ];
        const indice = Math.floor(Math.random() * fabricas.length);
        const nuevaPieza = fabricas[indice]?.() ?? new PieceSquare();
        return this.tablero.agregarPieza(nuevaPieza);
    }
}
