import { describe, it, expect } from "vitest";
import { Tetris } from "../src/Tetris.js";
import { PieceSquare } from "../src/pieces/PieceSquare.js";

describe("Tests de Tetris (Juego Principal)", () => {
    it("Deberia inicializarse correctamente pero no estar en curso", () => {
        const juego = new Tetris();
        expect(juego.isEnCurso).toBe(false);
    });

    it("Deberia iniciar el juego al llamar a start() con una pieza", () => {
        const juego = new Tetris();
        const square = new PieceSquare();
        
        juego.start(square);
        
        expect(juego.isEnCurso).toBe(true);
        // Podemos verificar accediendo de forma privada para el test
        const tablero = juego["tablero"];
        expect(tablero.piezaActual).toBe(square);
    });

    it("En cada tick() el reloj avanza y la pieza baja", () => {
        const juego = new Tetris();
        const square = new PieceSquare();
        juego.start(square);
        
        const tablero = juego["tablero"];
        const reloj = juego["reloj"];
        
        // Posicion inicial
        expect(tablero.posicionActual?.y).toBe(0);
        expect(reloj.avances).toBe(0);
        
        // Primer tick
        juego.tick();
        
        expect(reloj.avances).toBe(1);
        expect(tablero.posicionActual?.y).toBe(1);
        
        // Segundo tick
        juego.tick();
        
        expect(reloj.avances).toBe(2);
        expect(tablero.posicionActual?.y).toBe(2);
    });
});
