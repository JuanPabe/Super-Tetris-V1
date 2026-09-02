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
        const accionesEnCurso: Record<string, () => boolean> = {
            false: () => false,
            true: () => {
                this._estado = "jugando";
                this.enCurso = true;
                this.reloj.avanzar();

                this.procesarPaso();

                const respuestasFin: Record<string, () => boolean> = {
                    true: () => {
                        this.finalizarJuego();
                        return false;
                    },
                    false: () => this._estado === "jugando"
                };

                return respuestasFin[String(this.haFinalizado())]();
            }
        };

        return accionesEnCurso[String(this.isEnCurso)]();
    }

    rotarIzquierda(): boolean {
        const acciones: Record<string, () => boolean> = {
            false: () => false,
            true: () => this.tablero.rotarPiezaActual("izquierda")
        };
        return acciones[String(this.isEnCurso)]();
    }

    rotarDerecha(): boolean {
        const acciones: Record<string, () => boolean> = {
            false: () => false,
            true: () => this.tablero.rotarPiezaActual("derecha")
        };
        return acciones[String(this.isEnCurso)]();
    }

    private procesarPaso(): void {
        const hayPieza = Boolean(this.tablero.piezaActual);
        const pasos: Record<string, () => void> = {
            false: () => { this.incorporarNuevaPieza(); },
            true: () => { this.hacerDescenderPieza(); }
        };
        pasos[String(hayPieza)]();
    }

    private incorporarNuevaPieza(): void {
        const agregada = this.generarYAgregarPieza();
        const manejarAgregada: Record<string, () => void> = {
            false: () => { this.finalizarJuego(); },
            true: () => {}
        };
        manejarAgregada[String(agregada)]();
    }

    private hacerDescenderPieza(): void {
        const pudoMover = this.tablero.moverAbajo();
        const debeGenerar = Boolean(!pudoMover && !this.haFinalizado());
        const manejarDescenso: Record<string, () => void> = {
            true: () => { this.generarYAgregarPieza(); },
            false: () => {}
        };
        manejarDescenso[String(debeGenerar)]();
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
        const nuevaPieza = fabricas[indice]();
        return this.tablero.agregarPieza(nuevaPieza);
    }
}
