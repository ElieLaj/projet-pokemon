import { PokemonMove } from "./pokemonMove.model";
import { Type } from "./type.model";

export class Monster {
  id: number;

  name: string;
  level: number;

  hp: number;
  maxHp: number;
  attack: number;
  defense: number;
  specialAttack: number;
  specialDefense: number;
  speed: number;
  
  expRate: number;
  pokemonMoves: PokemonMove[]; 
  types: Type[];

  baseAttack: number;
  baseDefense: number;
  baseSpecialAttack: number;
  baseSpecialDefense: number;
  baseSpeed: number;
  baseHp: number;


  constructor(
    id: number,
    name: string,
    baseHp: number,
    baseAttack: number,
    baseDefense: number,
    baseSpecialAttack: number,
    baseSpecialDefense: number,
    baseSpeed: number,
    expRate: number,
    pokemonMoves: any[],
    types: any[],
    level: number = 5
  ) {
    this.level = level;
    this.baseAttack = baseAttack;
    this.baseDefense = baseDefense;
    this.baseSpecialAttack = baseSpecialAttack;
    this.baseSpecialDefense = baseSpecialDefense;
    this.baseSpeed = baseSpeed;
    this.baseHp = baseHp;

    this.id = id;

    this.name = name;

    this.hp = Math.floor(((2 * baseHp + 31) * level) / 100 + level + 10);
    this.maxHp = this.hp;
    this.attack = Math.floor(((2 * baseAttack + 31) * level) / 100 + 5);
    this.defense = Math.floor(((2 * baseDefense + 31) * level) / 100 + 5);
    this.specialAttack = Math.floor(((2 * baseSpecialAttack + 31) * level) / 100 + 5);
    this.specialDefense = Math.floor(((2 * baseSpecialDefense + 31) * level) / 100 + 5);
    this.speed = Math.floor(((2 * baseSpeed + 31) * level) / 100 + 5);

    this.expRate = expRate;
    this.pokemonMoves = pokemonMoves;
    this.types = types;
  }

  recalculateStat() {
  
    this.hp = Math.floor(((2 * this.baseHp * this.level) / 100) + this.level + 10);
  
    this.attack =  Math.floor(((2 * this.baseAttack * this.level) / 100) + 5);
    this.defense =  Math.floor(((2 * this.baseDefense * this.level) / 100) + 5);
    this.specialAttack =  Math.floor(((2 * this.baseSpecialAttack * this.level) / 100) + 5);
    this.specialDefense =  Math.floor(((2 * this.baseSpecialDefense * this.level) / 100) + 5);
    this.speed =  Math.floor(((2 * this.baseSpeed * this.level) / 100) + 5);

}
}