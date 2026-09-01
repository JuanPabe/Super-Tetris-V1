import type { IRotator } from "./IRotator";

export abstract class PieceBase implements IRotator {
    private _name: string;

    constructor (name: string) {
        this. _name = name;
    
    }
    get name():string{
        return this._name;
    }
    abstract rotateLeft(): void;
    abstract rotateRight():void;
}