import { describe, it, expect } from "vitest";
import { PieceT } from "../src/pieces/PieceT.js";
import { PieceStick } from "../src/pieces/PieceStick.js";
import { PieceSquare } from "../src/pieces/PieceSquare.js";
import { PieceL } from "../src/pieces/PieceL.js";
import { PieceLRight } from "../src/pieces/PieceLRight.js";
import { PieceDog } from "../src/pieces/PieceDog.js";
import { PieceDogRight } from "../src/pieces/PieceDogRight.js";

describe("Tests de Piezas", () => {
    describe("Creación y forma inicial", () => {
        it("Crea PieceT correctamente", () => {
            const t = new PieceT();
            expect(t.nombre).toBe("T");
            expect(t.forma).toEqual([
                [false, true, false],
                [true, true, true]
            ]);
        });

        it("Debe crear PieceStick correctamente", () => {
            const stick = new PieceStick();
            expect(stick.nombre).toBe("Stick");
            expect(stick.forma).toEqual([
                [true],
                [true],
                [true],
                [true]
            ]);
        });

        it("Debe crear PieceSquare correctamente", () => {
            const square = new PieceSquare();
            expect(square.nombre).toBe("Square");
            expect(square.forma).toEqual([
                [true, true],
                [true, true]
            ]);
        });
        
        it("Debe crear PieceL correctamente", () => {
            const l = new PieceL();
            expect(l.nombre).toBe("L");
            expect(l.forma).toEqual([
                [true, false],
                [true, false],
                [true, true]
            ]);
        });

        it("Debe crear PieceDog correctamente", () => {
            const dog = new PieceDog();
            expect(dog.nombre).toBe("Dog");
            expect(dog.forma).toEqual([
                [false, true, true],
                [true, true, false]
            ]);
        });

        it("Debe crear PieceLRight correctamente", () => {
            const lRight = new PieceLRight();
            expect(lRight.nombre).toBe("LRight");
            expect(lRight.forma).toEqual([
                [false, true],
                [false, true],
                [true, true]
            ]);
        });

        it("Debe crear PieceDogRight correctamente", () => {
            const dogRight = new PieceDogRight();
            expect(dogRight.nombre).toBe("DogRight");
            expect(dogRight.forma).toEqual([
                [true, true, false],
                [false, true, true]
            ]);
        });
    });

    describe("Rotación de piezas", () => {
        it("PieceStick debería rotar a la derecha correctamente", () => {
            const stick = new PieceStick();
            stick.rotarDerecha();
            expect(stick.forma).toEqual([
                [true, true, true, true]
            ]);
        });

        it("PieceStick debería rotar a la izquierda correctamente", () => {
            const stick = new PieceStick();
            stick.rotarIzquierda();
            // Original es de 4 filas x 1 col
            // Rotar a la izquierda debería dar 1 fila x 4 cols
            expect(stick.forma).toEqual([
                [true, true, true, true]
            ]);
        });

        it("PieceSquare NO debería cambiar de forma al rotar", () => {
            const square = new PieceSquare();
            const originalShape = square.forma;
            square.rotarDerecha();
            expect(square.forma).toEqual(originalShape);
        });

        it("PieceT debería rotar a la derecha", () => {
            const t = new PieceT();
            t.rotarDerecha();
            expect(t.forma).toEqual([
                [true, false],
                [true, true],
                [true, false]
            ]);
        });
        
        it("PieceT rotada 4 veces debería volver a su estado original", () => {
            const t = new PieceT();
            const originalShape = t.forma;
            t.rotarDerecha();
            t.rotarDerecha();
            t.rotarDerecha();
            t.rotarDerecha();
            expect(t.forma).toEqual(originalShape);
        });

        it("PieceLRight debería rotar a la derecha y volver con rotarIzquierda", () => {
            const lRight = new PieceLRight();
            lRight.rotarDerecha();
            expect(lRight.forma).toEqual([
                [true, false, false],
                [true, true, true]
            ]);
            lRight.rotarIzquierda();
            expect(lRight.forma).toEqual([
                [false, true],
                [false, true],
                [true, true]
            ]);
        });

        it("PieceDogRight debería rotar a la derecha y volver con rotarIzquierda", () => {
            const dogRight = new PieceDogRight();
            dogRight.rotarDerecha();
            expect(dogRight.forma).toEqual([
                [false, true],
                [true, true],
                [true, false]
            ]);
            dogRight.rotarIzquierda();
            expect(dogRight.forma).toEqual([
                [true, true, false],
                [false, true, true]
            ]);
        });

        it("PieceBase no debería fallar al rotar con forma vacía", () => {
            class PieceVacia extends PieceT {
                constructor() {
                    super();
                    (this as any)._forma = [];
                }
            }
            const vacia = new PieceVacia();
            vacia.rotarDerecha();
            vacia.rotarIzquierda();
            expect(vacia.forma).toEqual([]);
        });
    });
});
