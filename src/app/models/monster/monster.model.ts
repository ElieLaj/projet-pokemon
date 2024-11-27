import { Effect } from "./effect.model";
import { PokemonMove } from "../pokemonMove.model";
import { Stage } from "../stage.model";
import { Type } from "./type.model";
import { transformManyPokemonDTO } from '../../utils/game.utils';
import { Evolution } from "./evolution.model";

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
  catchRate: number;

  pokemonMoves: PokemonMove[] = []; 
  learnset: PokemonMove[] = [];
  types: Type[];
  stages: Stage[] = [];
  effect: Effect | null = null;
  effectTurn: number = 0;

  baseAttack: number;
  baseDefense: number;
  baseSpecialAttack: number;
  baseSpecialDefense: number;
  baseSpeed: number;
  baseHp: number;
  specialId!: number;

  learnMovewaitList: PokemonMove[] = [];

  evolutions: Evolution[];

  canEvolve: boolean = false;

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
    level: number = 5,
    stages: Stage[] = [],
    catchRate: number = 85,
    evolutions: Evolution[] = []
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
    this.learnset = [...pokemonMoves];
    this.pokemonMoves = this.learnMoves(pokemonMoves);
    this.types = types;

    this.stages = stages;
    this.catchRate = catchRate;
    this.evolutions = [...evolutions];
  }


  learnMove(oldMove: PokemonMove | null = null) {
    const newMove = this.learnMovewaitList.shift();
    if (newMove) {
      // if (this.pokemonMoves.length < 4) {
      //   this.pokemonMoves.push(newMove);
      //   return;
      // }
      this.pokemonMoves.push(newMove);
      this.pokemonMoves = this.pokemonMoves.filter(move => move !== oldMove);
    }
  }

  levelUp() {
    this.level++;

    for (const move of this.learnset) {
      if (move.level === this.level) {
        // if (this.pokemonMoves.length < 4) {
        //   this.pokemonMoves.push(move);
        // }
        // else {
          this.learnMovewaitList.push(move);
        // }
      }
    }

    this.recalculateStats();
    this.calculateExpToNextLevel();

    if (this.evolutions[0].levelRequired){
      if (this.level >= this.evolutions[0].levelRequired) {
            this.canEvolve = true;
          }
    }
  }

  learnMoves(moves: PokemonMove[]) {
    const _moves = [...moves]
    _moves.sort((a, b) => a.level - b.level);
    for (const move of _moves) {
      if (this.pokemonMoves.length < 4 && move && this.level >= move.level ) {
        this.pokemonMoves.push(move);
      }
    }
    return this.pokemonMoves;
  }

  gainEnemyExp(enemy: Monster, dialogues:string[], isWild: boolean = true) {
    const modifier = isWild ? 1 : 1.5;
    const exp = Math.floor((enemy.expRate * enemy.level * modifier) / 7) * enemy.level;
    dialogues.push(`${this.name} gained ${exp} exp!`);
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

  addEffect(effect: Effect, dialogues: string[]) {
    if (!this.effect) {
      this.effectTurn = 0;
      this.effect = effect;
      dialogues.push(`${this.name} was ${effect.name}!`);
    }
  }

  tryRemovingEffect(dialogues: string[]) {
    if (this.effect) {
      if (this.effect.turns) {
        if (this.effectTurn >= this.effect.turns) {
          this.removeEffect(dialogues);
        }
        else{
          Math.random() < 0.2 ? this.removeEffect(dialogues) : dialogues.push(`${this.name} is still ${this.effect.name}!`);
          this.effectTurn++;
        }
      }
    }
  }

  removeEffect(dialogues: string[]) {
    if (this.effect) {
      dialogues.push(`${this.name} is no longer ${this.effect.name}!`);
      this.effect = null;
      this.effectTurn = 0;
    }
  }

  sufferEffect(dialogues: string[]) {
    if (this.effect?.damage) {
      this.hp = Math.max(this.hp - Math.floor(this.maxHp * this.effect.damage), 0)
      dialogues.push(`${this.name} suffered damage for being ${this.effect.name}!`);
    }
  }

}