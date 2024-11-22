import { Category } from './category.model';
import { MoveEffect } from './moveEffect.model';
import { Type } from './type.model';

export class Move {
    id: number
    name: string;
    power: number;
    accuracy: number;
    type: Type;
    category: Category;
    moveEffect: MoveEffect;

    constructor(id: number, name: string, power: number, accuracy: number, type: Type, category: Category, moveEffect: MoveEffect) {
        this.id = id;
        this.name = name;
        this.power = power;
        this.accuracy = accuracy;
        this.type = type;
        this.category = category;
        this.moveEffect = moveEffect;
    }
}