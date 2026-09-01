import { describe, it, expect } from "vitest";
import { Clock } from "../src/Clock.js";

describe("Tests de Clock", () => {
    it("Debería inicializarse en 0", () => {
        const reloj = new Clock();
        expect(reloj.avances).toBe(0);
    });

    it("Debería avanzar de a 1 (tick)", () => {
        const reloj = new Clock();
        
        reloj.avanzar();
        expect(reloj.avances).toBe(1);
        
        reloj.avanzar();
        expect(reloj.avances).toBe(2);
    });
});
