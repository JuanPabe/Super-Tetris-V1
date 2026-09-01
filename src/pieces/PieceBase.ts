import type { IRotator } from "./IRotator.js";

export abstract class PieceBase implements IRotator {
    private _name: string;
    private _shape: boolean[][];

    constructor(name: string, shape: boolean[][]) {
        this._name = name;
        this._shape = shape;
    }

    get name(): string {
        return this._name;
    }

    get shape(): boolean[][] {
        return this._shape;
    }

    private set shape(value: boolean[][]) {
        this._shape = value;
    }

    rotateLeft(): void {
    const original = this.shape;
    const filas = original.length;
    const columnas = original[0].length;
    const nuevaForma: boolean[][] = [];

    for (let col = columnas - 1; col >= 0; col--) {
        const nuevaFila: boolean[] = [];
        for (let fila = 0; fila < filas; fila++) {
            nuevaFila.push(original[fila][col]?? false);
        }
        nuevaForma.push(nuevaFila);
    }

    this.shape = nuevaForma;
}
    rotateRight(): void {
    const original = this.shape;
    const filas = original.length;
    const columnas = original[0].length;
    const nuevaForma: boolean[][] = [];

    for (let col = 0; col < columnas; col++) {
        const nuevaFila: boolean[] = [];
        for (let fila = filas - 1; fila >= 0; fila--) {
            nuevaFila.push(original[fila][col]?? false);
        }
        nuevaForma.push(nuevaFila);
    }

    this.shape = nuevaForma;
}
}