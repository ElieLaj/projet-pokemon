import { Monster } from "./monster.model";
import { MonsterDTO } from "./monsterDTO.model";

export class EvolutionDTO {
    id: number;
    fromPokemon: MonsterDTO;
    toPokemon: MonsterDTO;
    levelRequired: number;

    constructor(id: number, fromPokemon: MonsterDTO, toPokemon: MonsterDTO, levelRequired: number) {
        this.id = id;
        this.fromPokemon = fromPokemon;
        this.toPokemon = toPokemon;
        this.levelRequired = levelRequired;
    }
}