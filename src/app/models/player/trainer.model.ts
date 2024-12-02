import { Bag } from "./bag.model";
import { Monster } from "../monster/monster.model";
import { createNewPokemon } from "../../utils/game.utils";

export class Trainer {
    name: string;
    monsters: Monster[];
    money: number;
    bag: Bag;
    pokemonId: number = 0;

    box: Monster[] = [];

    constructor(name: string, monsters: Monster[], money: number, bag: Bag) {
        this.name = name;
        this.monsters = [];
        this.addManyMonsters(monsters);
        this.money = money;
        this.bag = bag;
    }

    addMonster(monster: Monster): void {
        const newMonster = createNewPokemon(monster, this.pokemonId);
        this.pokemonId++;
        newMonster.specialId = this.pokemonId;
        if (this.monsters.length < 6) {
            this.monsters.push(newMonster);
        } else {
            this.box.push(newMonster);
        }
    }

    addManyMonsters(monsters: Monster[]): void {
        monsters.forEach(monster => {
            const newMonster = createNewPokemon(monster, this.pokemonId);
            this.addMonster(newMonster);
        });
    }

}