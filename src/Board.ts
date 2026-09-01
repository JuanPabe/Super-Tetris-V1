import { PieceBase } from "./pieces/PieceBase.js";

export class Board {
    private readonly ancho: number = 10;
    private readonly alto: number = 20;
    private grilla: boolean[][];
    private piezas: PieceBase[];
    private piezaActual: PieceBase | null;
    private _cantidadLineas: number;

    constructor(ancho: number = 10, alto: number = 20) {
        this.ancho = ancho;
        this.alto = alto;
        this.grilla = Array.from({ length: alto }, () => Array(ancho).fill(false));
        this.piezas = [];
        this.piezaActual = null;
        this._cantidadLineas = 0;
    }
}

