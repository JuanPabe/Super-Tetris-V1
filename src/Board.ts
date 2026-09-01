import { PieceBase } from "./pieces/PieceBase.js";

export class Board {
    private readonly ancho: number = 10;
    private readonly alto: number = 20;
    private _grilla: boolean[][];
    private _piezas: PieceBase[];
    private _piezaActual: PieceBase | null = null;
    private _posicionActual: { x: number; y: number } | null = null;
    private _cantidadLineas: number = 0;

    constructor(ancho: number = 10, alto: number = 20) {
        this.ancho = ancho;
        this.alto = alto;
        this._grilla = Array.from({ length: alto }, () => Array(ancho).fill(false));
        this._piezas = [];
    }

    get grilla(): boolean[][] {
        return this._grilla.map((fila) => [...fila]);
    }

    get piezas(): PieceBase[] {
        return [...this._piezas];
    }

    get piezaActual(): PieceBase | null {
        return this._piezaActual;
    }

    get posicionActual(): { x: number; y: number } | null {
        return this._posicionActual ? { ...this._posicionActual } : null;
    }

    get cantidadLineas(): number {
        return this._cantidadLineas;
    }

    agregarPieza(pieza: PieceBase, columna?: number): boolean {
        const anchoPieza = pieza.forma[0]?.length ?? 1;
        const posX = columna ?? Math.floor(Math.random() * Math.max(1, this.ancho - anchoPieza + 1));
        const posY = 0;

        if (!this.puedeColocar(pieza, posX, posY)) {
            return false;
        }

        this._piezaActual = pieza;
        this._posicionActual = { x: posX, y: posY };
        this._piezas.push(pieza);
        return true;
    }

    moverAbajo(): boolean {
        if (!this._piezaActual || !this._posicionActual) return false;

        const nuevaY = this._posicionActual.y + 1;

        if (this.puedeColocar(this._piezaActual, this._posicionActual.x, nuevaY)) {
            this._posicionActual.y = nuevaY;
            return true;
        }

        this.fijarPiezaActual();
        this.limpiarLineasCompletas();
        this._piezaActual = null;
        this._posicionActual = null;
        return false;
    }

    rotarPiezaActual(direccion: "izquierda" | "derecha" = "derecha"): boolean {
        if (!this._piezaActual || !this._posicionActual) return false;

        direccion === "derecha" ? this._piezaActual.rotarDerecha() : this._piezaActual.rotarIzquierda();

        if (!this.puedeColocar(this._piezaActual, this._posicionActual.x, this._posicionActual.y)) {
            direccion === "derecha" ? this._piezaActual.rotarIzquierda() : this._piezaActual.rotarDerecha();
            return false;
        }

        return true;
    }

    limpiarLineasCompletas(): number {
        const lineasIncompletas = this._grilla.filter((fila) => !fila.every((celda) => celda));
        const lineasEliminadas = this.alto - lineasIncompletas.length;

        if (lineasEliminadas > 0) {
            const nuevasFilasVacias = Array.from({ length: lineasEliminadas }, () => Array(this.ancho).fill(false));
            this._grilla = [...nuevasFilasVacias, ...lineasIncompletas];
            this._cantidadLineas += lineasEliminadas;
        }

        return lineasEliminadas;
    }

    esGameOver(): boolean {
        return this._grilla[0]?.some((celda) => celda) ?? false;
    }

    private puedeColocar(pieza: PieceBase, posX: number, posY: number): boolean {
        return pieza.forma.every((fila, fIndex) =>
            fila.every((celda, cIndex) => {
                if (!celda) return true;
                const targetY = posY + fIndex;
                const targetX = posX + cIndex;
                const celdaFila = this._grilla[targetY];
                return (
                    targetX >= 0 &&
                    targetX < this.ancho &&
                    targetY >= 0 &&
                    targetY < this.alto &&
                    celdaFila !== undefined &&
                    !celdaFila[targetX]
                );
            })
        );
    }

    private fijarPiezaActual(): void {
        if (!this._piezaActual || !this._posicionActual) return;

        const { x: posX, y: posY } = this._posicionActual;
        this._piezaActual.forma.forEach((fila, fIndex) =>
            fila.forEach((celda, cIndex) => {
                const targetY = posY + fIndex;
                const targetX = posX + cIndex;
                const celdaFila = this._grilla[targetY];
                if (celda && celdaFila && targetX >= 0 && targetX < this.ancho) {
                    celdaFila[targetX] = true;
                }
            })
        );
    }
}
