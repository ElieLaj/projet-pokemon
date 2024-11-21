import { Type } from './type.model';

export class Move {
    id: number
    name: string;
    power: number;
    accuracy: number;
    type: Type;

    constructor(id: number, name: string, power: number, accuracy: number, type: Type) {
        this.id = id;
        this.name = name;
        this.power = power;
        this.accuracy = accuracy;
        this.type = type;
    }
}