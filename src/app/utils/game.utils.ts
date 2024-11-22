import e from 'express';
import { MonsterType } from './monster.utils';
import { MonsterDTO } from '../models/monsterDTO.model';
import { Monster } from '../models/monster.model';

export enum TurnType {
    Player = 'Player',
    Enemy = 'Enemy',
    Dialogue = 'Dialogue'
}

export enum ActionType {
    Attack = 'Attack',
    Item = 'Item',
    Run = 'Run',
    Swap = 'Swap'
}


const typeEffectiveness: Record<string, Record<string, number>> = {
  Normal: { Rock: 0.5, Ghost: 0, Steel: 0.5 },
  Fire: { Grass: 2, Water: 0.5, Fire: 0.5, Rock: 0.5, Bug: 2, Steel: 2, Ice: 2, Dragon: 0.5 },
  Water: { Fire: 2, Grass: 0.5, Water: 0.5, Ground: 2, Rock: 2, Dragon: 0.5 },
  Electric: { Water: 2, Grass: 0.5, Electric: 0.5, Flying: 2, Ground: 0, Dragon: 0.5 },
  Grass: { Water: 2, Fire: 0.5, Grass: 0.5, Ground: 2, Rock: 2, Flying: 0.5, Bug: 0.5, Dragon: 0.5, Steel: 0.5 },
  Ice: { Grass: 2, Fire: 0.5, Water: 0.5, Ice: 0.5, Ground: 2, Flying: 2, Dragon: 2, Steel: 0.5 },
  Fighting: { Normal: 2, Rock: 2, Steel: 2, Ice: 2, Dark: 2, Ghost: 0, Flying: 0.5, Psychic: 0.5, Bug: 0.5, Fairy: 0.5 },
  Poison: { Grass: 2, Poison: 0.5, Ground: 0.5, Rock: 0.5, Ghost: 0.5, Steel: 0, Fairy: 2 },
  Ground: { Fire: 2, Electric: 2, Grass: 0.5, Poison: 2, Rock: 2, Bug: 0.5, Flying: 0, Steel: 2 },
  Flying: { Grass: 2, Electric: 0.5, Fighting: 2, Bug: 2, Rock: 0.5, Steel: 0.5 },
  Psychic: { Fighting: 2, Poison: 2, Psychic: 0.5, Dark: 0, Steel: 0.5 },
  Bug: { Grass: 2, Fire: 0.5, Fighting: 0.5, Poison: 0.5, Flying: 0.5, Psychic: 2, Ghost: 0.5, Dark: 2, Steel: 0.5, Fairy: 0.5 },
  Rock: { Fire: 2, Ice: 2, Flying: 2, Bug: 2, Fighting: 0.5, Ground: 0.5, Steel: 0.5 },
  Ghost: { Normal: 0, Psychic: 2, Ghost: 2, Dark: 0.5 },
  Dragon: { Dragon: 2, Steel: 0.5, Fairy: 0 },
  Dark: { Psychic: 2, Ghost: 2, Fighting: 0.5, Dark: 0.5, Fairy: 0.5 },
  Steel: { Rock: 2, Ice: 2, Fairy: 2, Fire: 0.5, Water: 0.5, Electric: 0.5, Steel: 0.5 },
  Fairy: { Fighting: 2, Dragon: 2, Dark: 2, Fire: 0.5, Poison: 0.5, Steel: 0.5 }
};

export const calculateModifier = (attackingType: string, pokemonTypes: string[], defendingTypes: string[]): number => {
  let modifier = 1;
  if (pokemonTypes.includes(attackingType)) modifier *= 1.5;

  defendingTypes.forEach(defendingType => {
    if (typeEffectiveness[attackingType] && typeEffectiveness[attackingType][defendingType] !== undefined) {
      modifier *= typeEffectiveness[attackingType][defendingType];
    }
  });

  return modifier;
};

export const calculateDamage = (
  level: number,
  power: number,
  attack: number,
  defense: number,
  modifier: number
): number => {
  const baseDamage = Math.floor(
    (2 * level / 5 + 2) * power * (attack / defense) / 50 + 2
  );

  return Math.floor(baseDamage * modifier);
};

export const calculateAttackBg = (type: string): string => {
  switch (type) {
    case MonsterType.Grass:
      return '#78C850';
    case MonsterType.Fire:
      return '#F08030';
    case MonsterType.Water:
      return '#6890F0';
    case MonsterType.Electric:
      return '#F8D030';
    case MonsterType.Ice:
      return '#98D8D8';
    case MonsterType.Fighting:
      return '#C03028';
    case MonsterType.Poison:
      return '#A040A0';
    case MonsterType.Ground:
      return '#E0C068';
    case MonsterType.Flying:
      return '#A890F0';
    case MonsterType.Psychic:
      return '#F85888';
    case MonsterType.Bug:
      return '#A8B820';
    case MonsterType.Rock:
      return '#B8A038';
    case MonsterType.Ghost:
      return '#705898';
    case MonsterType.Dragon:
      return '#7038F8';
    case MonsterType.Dark:
      return '#705848';
    case MonsterType.Steel:
      return '#B8B8D0';
    case MonsterType.Fairy:
      return '#EE99AC';
    case MonsterType.Normal:
      return '#A8A878';
    default:
      return '#A8A878';
  }
};

export const transformManyPokemonDTO = (pokemons: MonsterDTO[]): Monster[] => {
  return pokemons.map((monster: MonsterDTO) => {
      return new Monster(
        monster.id,
        monster.name,
        monster.hp,
        monster.attack,
        monster.defense,
        monster.specialAttack,
        monster.specialDefense,
        monster.speed,
        monster.expRate,
        monster.pokemonMoves,
        monster.types
      );
    });
};

export const transformPokemonDTO = (pokemon: MonsterDTO): Monster => {
  return new Monster(
    pokemon.id,
    pokemon.name,
    pokemon.hp,
    pokemon.attack,
    pokemon.defense,
    pokemon.specialAttack,
    pokemon.specialDefense,
    pokemon.speed,
    pokemon.expRate,
    pokemon.pokemonMoves,
    pokemon.types
  );
};