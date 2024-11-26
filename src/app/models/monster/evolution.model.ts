import { Monster } from "./monster.model";

export class Evolution {
    id: number;
    fromPokemon: Monster;
    toPokemon: Monster;
    levelRequired: number;

    constructor(id: number, fromPokemon: Monster, toPokemon: Monster, levelRequired: number) {
        this.id = id;
        this.fromPokemon = fromPokemon;
        this.toPokemon = toPokemon;
        this.levelRequired = levelRequired;
    }
}