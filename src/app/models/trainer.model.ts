import { Bag } from "./bag.model";
import { Monster } from "./monster/monster.model";

export class Trainer {
    name: string;
    monsters: Monster[];
    money: number;
    bag: Bag;

    constructor(name: string, monsters: Monster[], money: number, bag: Bag) {
        this.name = name;
        this.monsters = monsters;
        this.money = money;
        this.bag = bag;
    }
}