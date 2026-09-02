import { describe, it, expect } from "vitest";
import { Tetris } from "../src/Tetris.js";
import { PieceSquare } from "../src/pieces/PieceSquare.js";
import { PieceStick } from "../src/pieces/PieceStick.js";
import { Board } from "../src/Board.js";
import { Clock } from "../src/Clock.js";

describe("Tests de Tetris (Juego Principal)", () => {
    it("Deberia inicializarse correctamente pero no estar en curso", () => {
        const juego = new Tetris();
        expect(juego.isEnCurso).toBe(false);
        expect(juego.estado).toBe("detenido");
        expect(juego.obtTablero).toBeInstanceOf(Board);
        expect(juego.obtReloj).toBeInstanceOf(Clock);
        expect(juego.cantidadLineas).toBe(0);
    });

    it("Deberia iniciar el juego al llamar a start() con una pieza", () => {
        const juego = new Tetris();
        const square = new PieceSquare();

        juego.start(square);

        expect(juego.isEnCurso).toBe(true);
        expect(juego.estado).toBe("jugando");
        const tablero = juego.obtTablero;
        expect(tablero.piezaActual).toBe(square);
    });

    it("Deberia iniciar el juego al llamar a comenzar() generando una pieza", () => {
        const juego = new Tetris();
        juego.comenzar();
        expect(juego.isEnCurso).toBe(true);
        expect(juego.estado).toBe("jugando");
        expect(juego.obtTablero.piezaActual).not.toBeNull();
    });

    it("En cada tick() el reloj avanza y la pieza baja", () => {
        const juego = new Tetris();
        const square = new PieceSquare();
        juego.start(square);

        const tablero = juego.obtTablero;
        const reloj = juego.obtReloj;

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

    it("No permite rotar ni hacer tick si el juego no está en curso", () => {
        const juego = new Tetris();
        expect(juego.tick()).toBe(false);
        expect(juego.rotarIzquierda()).toBe(false);
        expect(juego.rotarDerecha()).toBe(false);
    });

    it("Permite rotar la pieza a la derecha e izquierda mientras el juego está activo", () => {
        const juego = new Tetris();
        const stick = new PieceStick();
        juego.start(stick);
        // Fijamos columna central para que la rotación horizontal (4 bloques) no colisione con las paredes
        juego.obtTablero["_posicionActual"] = { x: 3, y: 0 };

        expect(juego.rotarDerecha()).toBe(true);
        expect(juego.rotarIzquierda()).toBe(true);
    });

    it("Cuando la pieza llega al fondo, tick genera una nueva pieza", () => {
        const juego = new Tetris();
        const square = new PieceSquare();
        juego.start(square);

        // Bajamos la pieza hasta que toque fondo
        for (let i = 0; i < 18; i++) {
            juego.tick();
        }

        // El siguiente tick fijará la pieza y agregará una nueva automáticamente
        juego.tick();
        expect(juego.obtTablero.piezas.length).toBeGreaterThanOrEqual(2);
    });

    it("Finaliza el juego si se alcanza la cantidad de líneas objetivo", () => {
        const juego = new Tetris(1);
        const square = new PieceSquare();
        juego.start(square);

        // Simulamos que la fila inferior está casi llena
        juego.obtTablero["_grilla"][19] = [true, true, true, true, true, true, true, true, false, false];

        // Llevamos la pieza al fondo en la columna correcta para completar línea
        juego.obtTablero["_posicionActual"] = { x: 8, y: 18 };

        // Al descender se completa 1 línea (línea objetivo = 1)
        juego.tick();

        expect(juego.cantidadLineas).toBe(1);
        expect(juego.estado).toBe("finalizado");
        expect(juego.isEnCurso).toBe(false);
    });

    it("Finaliza el juego si ocurre GameOver en el tablero", () => {
        const juego = new Tetris();
        juego.comenzar();

        // Simulamos bloqueo en la parte superior del tablero
        juego.obtTablero["_grilla"][0][4] = true;

        const continua = juego.tick();
        expect(continua).toBe(false);
        expect(juego.estado).toBe("finalizado");
        expect(juego.isEnCurso).toBe(false);
    });

    it("Si el juego está activo pero no hay pieza actual, tick genera una nueva pieza", () => {
        const juego = new Tetris();
        juego["_estado"] = "jugando";
        juego["enCurso"] = true;

        const resultado = juego.tick();
        expect(resultado).toBe(true);
        expect(juego.obtTablero.piezaActual).not.toBeNull();
    });

    it("Finaliza el juego si no puede incorporar una nueva pieza", () => {
        const juego = new Tetris();
        juego["_estado"] = "jugando";
        juego["enCurso"] = true;

        // Llenamos la fila 0 completa para que ninguna pieza pueda agregarse
        juego.obtTablero["_grilla"][0].fill(true);

        const resultado = juego.tick();
        expect(resultado).toBe(false);
        expect(juego.estado).toBe("finalizado");
    });

    it("Genera aleatoriamente las diferentes fábricas de piezas", () => {
        const juego = new Tetris();
        for (let i = 0; i < 25; i++) {
            juego["generarYAgregarPieza"]();
            // Reseteamos pieza actual para poder generar otra
            juego.obtTablero["_piezaActual"] = null;
        }
        expect(juego.obtTablero.piezas.length).toBeGreaterThan(0);
    });
});
