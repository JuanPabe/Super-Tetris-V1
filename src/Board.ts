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
        const sePuede = this.puedeColocar(pieza, posX, posY);

        const respuestas: Record<string, () => boolean> = {
            true: () => {
                this._piezaActual = pieza;
                this._posicionActual = { x: posX, y: posY };
                this._piezas.push(pieza);
                return true;
            },
            false: () => false
        };

        return respuestas[String(sePuede)]();
    }

    moverAbajo(): boolean {
        const tienePieza = Boolean(this._piezaActual && this._posicionActual);
        const manejadores: Record<string, () => boolean> = {
            false: () => false,
            true: () => {
                const pieza = this._piezaActual!;
                const pos = this._posicionActual!;
                const nuevaY = pos.y + 1;
                const puedeMoverse = this.puedeColocar(pieza, pos.x, nuevaY);

                const acciones: Record<string, () => boolean> = {
                    true: () => {
                        pos.y = nuevaY;
                        return true;
                    },
                    false: () => {
                        this.fijarPiezaActual();
                        this.limpiarLineasCompletas();
                        this._piezaActual = null;
                        this._posicionActual = null;
                        return false;
                    }
                };

                return acciones[String(puedeMoverse)]();
            }
        };

        return manejadores[String(tienePieza)]();
    }

    rotarPiezaActual(direccion: "izquierda" | "derecha" = "derecha"): boolean {
        const tienePieza = Boolean(this._piezaActual && this._posicionActual);
        const manejadores: Record<string, () => boolean> = {
            false: () => false,
            true: () => {
                const pieza = this._piezaActual!;
                const pos = this._posicionActual!;

                const rotaciones: Record<"izquierda" | "derecha", () => void> = {
                    derecha: () => pieza.rotarDerecha(),
                    izquierda: () => pieza.rotarIzquierda()
                };
                const reversiones: Record<"izquierda" | "derecha", () => void> = {
                    derecha: () => pieza.rotarIzquierda(),
                    izquierda: () => pieza.rotarDerecha()
                };

                rotaciones[direccion]();

                const valida = this.puedeColocar(pieza, pos.x, pos.y);
                const resolver: Record<string, () => boolean> = {
                    true: () => true,
                    false: () => {
                        reversiones[direccion]();
                        return false;
                    }
                };

                return resolver[String(valida)]();
            }
        };

        return manejadores[String(tienePieza)]();
    }

    limpiarLineasCompletas(): number {
        const lineasIncompletas = this._grilla.filter((fila) => !fila.every((celda) => celda));
        const lineasEliminadas = this.alto - lineasIncompletas.length;
        const nuevasFilasVacias = Array.from({ length: lineasEliminadas }, () => Array(this.ancho).fill(false));
        this._grilla = [...nuevasFilasVacias, ...lineasIncompletas];
        this._cantidadLineas += lineasEliminadas;
        return lineasEliminadas;
    }

    esGameOver(): boolean {
        return this._grilla[0]?.some((celda) => celda) ?? false;
    }

    private puedeColocar(pieza: PieceBase, posX: number, posY: number): boolean {
        return pieza.forma.every((fila, fIndex) =>
            fila.every((celda, cIndex) => {
                const targetY = posY + fIndex;
                const targetX = posX + cIndex;
                const celdaFila = this._grilla[targetY];
                const dentroYVacio = Boolean(
                    targetX >= 0 &&
                    targetX < this.ancho &&
                    targetY >= 0 &&
                    targetY < this.alto &&
                    celdaFila !== undefined &&
                    !celdaFila[targetX]
                );
                return !celda || dentroYVacio;
            })
        );
    }

    private fijarPiezaActual(): void {
        const tienePieza = Boolean(this._piezaActual && this._posicionActual);
        const manejador: Record<string, () => void> = {
            false: () => {},
            true: () => {
                const pos = this._posicionActual!;
                this._piezaActual!.forma.forEach((fila, fIndex) =>
                    fila.forEach((celda, cIndex) => {
                        const targetY = pos.y + fIndex;
                        const targetX = pos.x + cIndex;
                        const celdaFila = this._grilla[targetY];
                        const pintar: Record<string, () => void> = {
                            true: () => { celdaFila![targetX] = true; },
                            false: () => {}
                        };
                        const debePintar = Boolean(celda && celdaFila && targetX >= 0 && targetX < this.ancho);
                        pintar[String(debePintar)]();
                    })
                );
            }
        };
        manejador[String(tienePieza)]();
    }
}
