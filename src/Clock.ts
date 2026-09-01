export class Clock {
    private _avances: number;

    constructor() {
        this._avances = 0;
    }

    get avances(): number {
        return this._avances;
    }

    avanzar(): number {
        this._avances += 1;
        return this._avances;
    }
}
