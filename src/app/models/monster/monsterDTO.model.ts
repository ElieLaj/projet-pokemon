import { PokemonMove } from "../pokemonMove.model";
import { Stage } from "../stage.model";
import { EvolutionDTO } from "./evolutionDTO.model";
import { Type } from "./type.model";

export class MonsterDTO {
    id: number;
    name: string;
    type: string;
    hp: number;
    attack: number;
    defense: number;
    specialAttack: number;
    specialDefense: number;
    speed: number;
    expRate: number;
    maxHp: number;
    pokemonMoves: PokemonMove[];
    types: Type[];
    level: number = 5;
    stages: Stage[] = [];
    catchRate: number;
    evolutions: EvolutionDTO[] = [];

    constructor(id: number, name: string, type: string, hp: number,
                attack: number, defense: number, specialAttack: number, 
                specialDefense: number, speed: number, expRate: number,
                catchRate: number, evolutions: EvolutionDTO[] = []
            )
    {
        this.id = id;
        this.name = name;
        this.type = type;
        this.hp = hp;
        this.attack = attack;
        this.speed = speed;
        this.maxHp = hp;
        this.defense = defense;
        this.specialAttack = specialAttack;
        this.specialDefense = specialDefense;
        this.expRate = expRate;
        this.pokemonMoves = [];
        this.types = [];
        this.catchRate = catchRate;
    }


}