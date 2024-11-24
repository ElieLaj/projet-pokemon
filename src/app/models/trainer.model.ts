import { Bag } from "./bag.model";
import { Monster } from "./monster/monster.model";

export class Trainer {
    name: string;
    monsters: Monster[];
    money: number;
    bag: Bag;
    pokemonId: number = 0;

    constructor(name: string, monsters: Monster[], money: number, bag: Bag) {
        this.name = name;
        this.monsters = [];
        this.addManyMonsters([...monsters]);
        this.money = money;
        this.bag = bag;
    }

    addMonster(monster: Monster): void {
        monster.specialId = this.pokemonId;
        this.pokemonId++;
        this.monsters.push(monster);
    }

    addManyMonsters(monsters: Monster[]): void {
        monsters.forEach(monster => {
            this.addMonster(monster);
        });
    }
}