import { Monster } from "../monster/monster.model";
import { MonsterDTO } from "../monster/monsterDTO.model";

export class Stage {
    id: number;
    name: string;
    pokemons: Monster[];

    constructor(id: number, name: string, pokemons: Monster[] = []) {
        this.id = id;
        this.name = name;
        this.pokemons = pokemons;
    }
}