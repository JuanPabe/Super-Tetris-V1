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
        if (!this.isEnCurso) return false;

        this._estado = "jugando";
        this.enCurso = true;
        this.reloj.avanzar();

        this.procesarPaso();

        if (this.haFinalizado()) {
            this.finalizarJuego();
            return false;
        }

        return this._estado === "jugando";
    }

    rotarIzquierda(): boolean {
        if (!this.isEnCurso) return false;
        return this.tablero.rotarPiezaActual("izquierda");
    }

    rotarDerecha(): boolean {
        if (!this.isEnCurso) return false;
        return this.tablero.rotarPiezaActual("derecha");
    }

    private procesarPaso(): void {
        if (!this.tablero.piezaActual) {
            this.incorporarNuevaPieza();
            return;
        }

        this.hacerDescenderPieza();
    }

    private incorporarNuevaPieza(): void {
        const agregada = this.generarYAgregarPieza();
        if (!agregada) {
            this.finalizarJuego();
        }
    }

    private hacerDescenderPieza(): void {
        const pudoMover = this.tablero.moverAbajo();
        if (!pudoMover && !this.haFinalizado()) {
            this.generarYAgregarPieza();
        }
    }

    private haFinalizado(): boolean {
        return this.tablero.cantidadLineas >= this.lineasObjetivo || this.tablero.esGameOver();
    }

    private finalizarJuego(): void {
        this._estado = "finalizado";
        this.enCurso = false;
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
