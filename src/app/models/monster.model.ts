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
  
  currentExp: number;
  neededExp: number;
  expRate: number;
  pokemonMoves: PokemonMove[] = []; 
  learnset: PokemonMove[] = [];
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

    this.currentExp = 0;
    this.expRate = expRate;
    this.neededExp = Math.floor((1.2 * Math.pow(level, 3)) - 15 * Math.pow(level, 2) + 100 * level - 140);
    this.pokemonMoves = this.learnMoves(pokemonMoves);
    this.types = types;

    this.learnset = pokemonMoves;
  }

  levelUp() {
    this.level++;
    this.recalculateStats();
    this.calculateExpToNextLevel();
  }

  learnMoves(moves: PokemonMove[]) {
    moves.sort((a, b) => a.level - b.level);
    for (const move of moves.splice(moves.length - 5, 4)) {
      if (this.pokemonMoves.length< 4 && move && this.level >= move.level ) {
        this.pokemonMoves.push(move);
      }
    }
    return this.pokemonMoves;
  }

  gainEnemyExp(enemy: Monster, isWild: boolean = true) {
    const modifier = isWild ? 1 : 1.5;
    const exp = Math.floor((enemy.expRate * enemy.level * modifier) / 7);
    this.gainExp(exp);
  }

  gainExp(exp: number) {
    if (this.level < 100) {
      if (exp + this.currentExp >= this.neededExp) {
        exp = (this.currentExp + exp) - this.neededExp;
        this.levelUp();
        this.gainExp(exp);
      } else {
        this.currentExp +=  exp;
      }
    }
  }

  calculateExpToNextLevel() {
    this.currentExp = 0;
    this.neededExp = Math.floor((1.2 * Math.pow(this.level, 3)) - 15 * Math.pow(this.level, 2) + 100 * this.level - 140);
  }

  recalculateStats() {
    const oldMaxHp = this.maxHp;
    this.maxHp = Math.floor(((2 * this.baseHp * this.level) / 100) + this.level + 10);
    this.hp += Math.max(this.maxHp - oldMaxHp, 0);

    this.attack =  Math.floor(((2 * this.baseAttack * this.level) / 100) + 5);
    this.defense =  Math.floor(((2 * this.baseDefense * this.level) / 100) + 5);
    this.specialAttack =  Math.floor(((2 * this.baseSpecialAttack * this.level) / 100) + 5);
    this.specialDefense =  Math.floor(((2 * this.baseSpecialDefense * this.level) / 100) + 5);
    this.speed =  Math.floor(((2 * this.baseSpeed * this.level) / 100) + 5);

  }

  heal(hpHealed: number) {
    this.hp = Math.min(this.hp + hpHealed, this.maxHp);
  }

}