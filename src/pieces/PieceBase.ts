import type { IRotator } from "./IRotator.js";

export abstract class PieceBase implements IRotator {
    private _nombre: string;
    private _forma: boolean[][];

    constructor(nombre: string, forma: boolean[][]) {
        this._nombre = nombre;
        this._forma = forma;
    }

    get nombre(): string {
        return this._nombre;
    }

    get forma(): boolean[][] {
        return this._forma;
    }

    private set forma(valor: boolean[][]) {
        this._forma = valor;
    }

    rotarIzquierda(): void {
        const original = this.forma;
        const filas = original.length;
        const columnas = original[0]?.length ?? 0;
        const nuevaForma: boolean[][] = [];

        for (let col = columnas - 1; col >= 0; col--) {
            const nuevaFila: boolean[] = [];
            for (let fila = 0; fila < filas; fila++) {
                nuevaFila.push(original[fila]?.[col] ?? false);
            }
            nuevaForma.push(nuevaFila);
        }

        const aplicar: Record<string, () => void> = {
            true: () => { this.forma = nuevaForma; },
            false: () => {}
        };
        aplicar[String(columnas > 0)]();
    }

    rotarDerecha(): void {
        const original = this.forma;
        const filas = original.length;
        const columnas = original[0]?.length ?? 0;
        const nuevaForma: boolean[][] = [];

        for (let col = 0; col < columnas; col++) {
            const nuevaFila: boolean[] = [];
            for (let fila = filas - 1; fila >= 0; fila--) {
                nuevaFila.push(original[fila]?.[col] ?? false);
            }
            nuevaForma.push(nuevaFila);
        }

        const aplicar: Record<string, () => void> = {
            true: () => { this.forma = nuevaForma; },
            false: () => {}
        };
        aplicar[String(columnas > 0)]();
    }
}