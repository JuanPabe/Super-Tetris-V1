import { describe, it, expect } from "vitest";
import { Board } from "../src/Board.js";
import { PieceSquare } from "../src/pieces/PieceSquare.js";
import { PieceStick } from "../src/pieces/PieceStick.js";
import { PieceT } from "../src/pieces/PieceT.js";

describe("Tests de Tablero (Board)", () => {
    it("Deberia tener el formato correcto inicial (10x20)", () => {
        const board = new Board();
        const grilla = board.grilla;
        
        expect(grilla.length).toBe(20); // 20 filas
        expect(grilla[0].length).toBe(10); // 10 columnas
        
        // Verifica que este todo vacio (false)
        const estaVacia = grilla.every(fila => fila.every(celda => celda === false));
        expect(estaVacia).toBe(true);
    });

    it("Deberia permitir agregar una pieza completa y que no se pase de los limites", () => {
        const board = new Board();
        const square = new PieceSquare(); // Forma de 2x2
        
        // La agregamos en una columna especifica para predecir donde cae (ej: columna 4)
        const agregada = board.agregarPieza(square, 4);
        
        expect(agregada).toBe(true);
        expect(board.piezaActual).toBe(square);
        expect(board.posicionActual).toEqual({ x: 4, y: 0 });
    });

    it("No deberia permitir agregar una pieza si excede los limites (colision)", () => {
        const board = new Board();
        const stick = new PieceStick(); // 4x1 (4 alto x 1 ancho)
        
        // El tablero tiene ancho 10 (indices 0 al 9).
        // Rotamos el stick para que ocupe 4 de ancho.
        stick.rotarDerecha(); 
        
        // Intentamos ponerlo en la columna 8 (ocuparia 8, 9, 10, 11) -> se pasa del limite.
        const agregada = board.agregarPieza(stick, 8);
        
        expect(agregada).toBe(false);
    });

    it("Que al agregar una pieza se pueda rotar aleatoriamente y siga en el tablero", () => {
        const board = new Board();
        const t = new PieceT();
        board.agregarPieza(t, 4);
        
        // Rotar a la derecha
        const rotada = board.rotarPiezaActual("derecha");
        expect(rotada).toBe(true);
        expect(board.piezaActual?.forma).toEqual([
            [true, false],
            [true, true],
            [true, false]
        ]);
    });

    it("En cada movimiento la pieza actual baja una fila", () => {
        const board = new Board();
        const square = new PieceSquare();
        board.agregarPieza(square, 4);
        
        // Posicion inicial y = 0
        expect(board.posicionActual?.y).toBe(0);
        
        // Mover abajo
        const movio = board.moverAbajo();
        expect(movio).toBe(true);
        
        // Nueva posicion y = 1
        expect(board.posicionActual?.y).toBe(1);
    });

    it("Al llegar al fondo, la pieza se fija al tablero (bloqueo)", () => {
        const board = new Board();
        const square = new PieceSquare(); // 2x2
        board.agregarPieza(square, 0); // la ponemos a la izquierda
        
        // Bajamos hasta el fondo (20 filas - 2 de alto de la pieza = 18 movimientos posibles)
        for (let i = 0; i < 18; i++) {
            board.moverAbajo();
        }
        
        // En y = 18 esta en el limite inferior. Un movimiento mas debe devolver false y fijar la pieza
        const movio = board.moverAbajo();
        expect(movio).toBe(false);
        
        // Verificamos que la pieza ya no sea la actual (se fijo)
        expect(board.piezaActual).toBeNull();
        
        // Verificamos que ahora hay celdas "true" en el fondo de la grilla
        const grilla = board.grilla;
        expect(grilla[18][0]).toBe(true);
        expect(grilla[19][1]).toBe(true);
    });

    it("Que al completarse una linea con varias piezas, se sume y se elimine esa linea", () => {
        const board = new Board();
        
        // Simulamos una situacion donde la fila inferior (fila 19) esta casi llena (las primeras 8 columnas en true)
        // Hacemos un poco de trampa testeando el comportamiento interno accediendo a la variable privada
        // pero como es la unica forma rapida de simularlo para un unit test:
        board["_grilla"][19] = [true, true, true, true, true, true, true, true, false, false];
        
        // Ahora tiramos un PieceSquare (2x2) en la columna 8 para que caiga y llene la ultima linea
        const square = new PieceSquare();
        board.agregarPieza(square, 8);
        
        // Lo bajamos hasta que choque y se fije
        let moviendo = true;
        while (moviendo) {
            moviendo = board.moverAbajo();
        }
        
        // Deberia haberse limpiado 1 linea (la 19)
        expect(board.cantidadLineas).toBe(1);
        
        // Y la nueva fila inferior deberia ser la que estaba en la 18 pero desplazada
        // En este caso el cuadrado ocupo fila 18 y 19. Al borrarse la 19, la parte de arriba del cuadrado 
        // (fila 18) baja a la fila 19.
        const grilla = board.grilla;
        expect(grilla[19][8]).toBe(true); // Parte superior del cuadrado cayo a la fila final
        expect(grilla[19][9]).toBe(true);
        expect(grilla[19][0]).toBe(false); // Las primeras 8 columnas se borraron
    });

    it("Debería retornar las piezas agregadas a través del getter piezas", () => {
        const board = new Board();
        expect(board.piezas).toEqual([]);
        const square = new PieceSquare();
        board.agregarPieza(square, 0);
        expect(board.piezas.length).toBe(1);
        expect(board.piezas[0]).toBe(square);
    });

    it("Debería revertir la rotación si colisiona con el borde del tablero (derecha e izquierda)", () => {
        const board = new Board();
        const stick = new PieceStick();
        board.agregarPieza(stick, 9);

        const pudoRotarDerecha = board.rotarPiezaActual("derecha");
        expect(pudoRotarDerecha).toBe(false);
        expect(board.piezaActual?.forma.length).toBe(4);

        const pudoRotarIzquierda = board.rotarPiezaActual("izquierda");
        expect(pudoRotarIzquierda).toBe(false);
        expect(board.piezaActual?.forma.length).toBe(4);
    });

    it("Debería retornar false al intentar rotar o mover sin pieza actual", () => {
        const board = new Board();
        expect(board.moverAbajo()).toBe(false);
        expect(board.rotarPiezaActual("derecha")).toBe(false);
        expect(board.rotarPiezaActual("izquierda")).toBe(false);
        expect(board.posicionActual).toBeNull();
    });

    it("Debería detectar correctamente el estado de GameOver cuando hay bloques en la primera fila", () => {
        const board = new Board();
        expect(board.esGameOver()).toBe(false);
        board["_grilla"][0][4] = true;
        expect(board.esGameOver()).toBe(true);
    });

    it("Permite agregar pieza sin especificar columna (columna aleatoria válida)", () => {
        const board = new Board();
        const square = new PieceSquare();
        const agregada = board.agregarPieza(square);
        expect(agregada).toBe(true);
        expect(board.posicionActual?.x).toBeGreaterThanOrEqual(0);
        expect(board.posicionActual?.x).toBeLessThanOrEqual(8);
    });
});
