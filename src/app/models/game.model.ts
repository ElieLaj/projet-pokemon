import { ActionType, calculateDamage, TurnType, createNewPokemon } from "../utils/game.utils";
import { EffectType } from "../utils/monster.utils";
import { HealingItem } from "./healingItem.model";
import { Item } from "./item.model";
import { Monster } from "./monster/monster.model";
import { Move } from "./monster/move.model";
import { MoveEffect } from "./monster/moveEffect.model";
import { Pokeball } from "./pokeball.model";
import { PokemonMove } from "./pokemonMove.model";
import { Stage } from "./stage.model";
import { Trainer } from "./trainer.model";

export class Game {
  player: Trainer;

  enemyMonster: Monster;

  dialogues: string[] = [];

  lastTurn!: TurnType;
  turn: TurnType = TurnType.Dialogue;

  enemyTurn: boolean = false;
  turnEnded: boolean = false;

  TurnType = TurnType;
  ActionType = ActionType;

  playerSelectedAttack: Move | null = null;
  playerSelectedItem: Item | null = null;
  playerSelectedBag: Item[] = [];
  playerSelectedMonster: Monster | null = null;

  playerAction: ActionType | null = null;
  enemyAction: ActionType | null = null;
  enemySelectedAttack: Move | null = null;

  playerMonster: Monster;

  playerScore: number = 0;
  playerLost: boolean = false;
  enemyLost: boolean = false;

  currentTurn: number = 0;
  
  battleNumber: number = 0;

  showMoves: boolean = false;

  forgetMoveSelected: PokemonMove | null = null;

  stage!: Stage;

  battleCount: number = 1;
  enemyLevel: number = 5;

  shopOpen: boolean = false;

  balls: Pokeball[] = [];
  hItems: HealingItem[] = [];

  constructor(player: Trainer, enemyMonster: Monster) {
    this.player = player;
    this.enemyMonster = enemyMonster;
    this.playerMonster = player.monsters[0];

  }

  checkTurn() {
    if(this.turn === TurnType.Dialogue) {
      if (this.dialogues.length === 0) {
        if (this.turnEnded){
          this.turn = this.playerMonster.speed > this.enemyMonster.speed ? TurnType.Player : TurnType.Enemy;
        }
        else {
          this.turn = this.lastTurn === TurnType.Player ? TurnType.Enemy : TurnType.Player;
        }
          
      }
    }
    if (this.playerMonster.hp <= 0 || this.enemyMonster.hp <= 0) {
      if (this.playerMonster.hp <= 0 && this.checkPokemonsHealth() === false) {
        this.dialogues.push('You lost!');
        this.playerLost = true;
      }
      else if (this.player.monsters.length > 1 && this.playerMonster.hp <= 0 && this.checkPokemonsHealth()) {
        this.dialogues.push('Choose another pokemon!');
        this.setAction(ActionType.SelectSwap);
      }
      else {
        if (this.enemyLost) {
          this.dialogues.push('You won!');
          this.playerAction = null;
          this.enemyAction = null;
          this.battleCount++;
          this.player.money += this.enemyLevel * 15;
          this.enemyLevel = Math.floor(this.battleCount / 3) + 5;
          this.shopOpen = this.battleCount % 3 === 0;
          if (this.battleCount % 6 === 0) {
            for(const pokemon of this.player.monsters) {
              pokemon.hp = pokemon.maxHp;
              pokemon.effect = null;
              pokemon.effectTurn = 0;
            }
          }
          this.enemyLost = false;
        }
      }
      this.turn = TurnType.Dialogue;
    }

    else if ((this.playerAction != null && this.playerAction != ActionType.SelectAttack && this.playerAction != ActionType.SelectSwap && this.playerAction != ActionType.SelectItem  && this.playerAction != ActionType.SelectItemType) || this.enemyAction != null) {
      this.turnEnded = false;
      this.playTurn();
    }
    else {
      this.turnEnded = true;
    }
  }

  checkPokemonsHealth(): boolean {
    return this.player.monsters.some(monster => monster.hp > 0);
  }
  checkPokemonEvolution(): boolean {
    return this.player.monsters.some(monster => monster.canEvolve);
  }

  playTurn() {
    if (this.enemyAction === ActionType.Attack) {
      this.enemySelectedAttack = this.enemyMonster.pokemonMoves[Math.floor(Math.random() * this.enemyMonster.pokemonMoves.length)].move;
    }
    if (
      (
        this.playerAction != ActionType.Attack || 
        (this.playerSelectedAttack?.moveEffects[0].effect.name === EffectType.MoveFirst && this.enemySelectedAttack?.moveEffects[0].effect.name !== EffectType.MoveFirst)) && 
        this.playerAction != null 
      ) 
    {
        this.playerTurn();
    }
    if (this.turn === TurnType.Enemy)
      this.performAttack(this.enemyMonster, this.playerMonster, this.enemySelectedAttack, false);
    else if (this.turn === TurnType.Player) 
      this.playerTurn();
  }

  playerTurn() {
    this.lastTurn = TurnType.Player;
    this.turn = TurnType.Dialogue;
    switch(this.playerAction) {
      case ActionType.Attack:
          this.performAttack(this.playerMonster, this.enemyMonster, this.playerSelectedAttack, true);;
        break;
      case ActionType.Item:
        if (this.playerSelectedItem instanceof Pokeball) {
          this.playerUsePokeball(this.playerSelectedItem, this.enemyMonster);
          this.playerSelectedItem = null;
        } 
        else if (this.playerSelectedItem instanceof HealingItem) {
          this.playerUseHealingItem(this.playerSelectedItem, this.playerMonster);
          this.playerSelectedItem = null;
        }
        break;
      case ActionType.Swap:
        if (this.player.monsters.length > 1 && this.playerSelectedMonster)
          this.playerChangeMonster(this.playerSelectedMonster);
        break;
      case ActionType.Run:
        this.playerRun();
        break;
    }
    this.playerAction = null;
    this.currentTurn++;
  }

  performAttack(attacker: Monster, defender: Monster, selectedAttack: Move | null, isPlayer: boolean) {

    attacker.tryRemovingEffect(this.dialogues);

    const paralyzed = attacker.effect?.name === 'Paralyzed' && Math.random() < 0.25;
    if (attacker.effect?.name === 'Sleeping' || attacker.effect?.name === 'Freezed' || paralyzed) {
      this.dialogues.push(`${attacker.name} is still ${attacker.effect?.name}!`);
      if (isPlayer) {
        this.playerAction = null;
        this.lastTurn = TurnType.Player;
        this.turn = TurnType.Dialogue;
      } else {
        this.enemyAction = null;
        this.lastTurn = TurnType.Enemy;
        this.turn = TurnType.Dialogue;
      }
      return;
    }

    if (attacker.effect?.name === 'Flinched') {
      attacker.removeEffect(this.dialogues);
      if (isPlayer) this.playerAction = null;
      else this.enemyAction = null;
      return;
    }

    const move = selectedAttack ?? 
      attacker.pokemonMoves[Math.floor(Math.random() * attacker.pokemonMoves.length)].move;

    calculateDamage(attacker, defender, move, this.dialogues);

    attacker.sufferEffect(this.dialogues);

    if (defender.hp <= 0) {
      if (isPlayer) {
        this.enemyLost = true;
        this.playerScore += 100;
        attacker.gainEnemyExp(defender, this.dialogues);
        for (const ally of this.player.monsters) {
          if (ally.hp > 0 && ally.specialId !== attacker.specialId) {
            ally.gainEnemyExp(defender, this.dialogues);
          }
        }
      } else {
        this.playerLost = true;
      }
      this.turnEnded = true;
      return;
    }

    if (isPlayer) {
      this.playerAction = null;
      this.playerSelectedAttack = null;
    } else {
      this.enemyAction = null;
      this.lastTurn = TurnType.Enemy;
      this.turn = TurnType.Dialogue;
    }

    if (defender.effect?.name === "Flinched" && (this.enemyAction === null && this.playerAction === null)) {
      defender.effect = null;
    }

  }

playerChangeMonster(newMonster: Monster) {
  const oldMonster = this.playerMonster;

  const newMonsterIndex = this.player.monsters.findIndex(
    monster => monster.specialId === newMonster.specialId
  );

  this.player.monsters[newMonsterIndex] = oldMonster;
  this.player.monsters[this.player.monsters.indexOf(oldMonster)] = newMonster;

  this.playerMonster = newMonster;


  this.dialogues.push(`${oldMonster.name}, return!`);
  this.dialogues.push(`${newMonster.name}, I choose you!`);
}

  chooseItemType(itemType: string) {
    if (itemType === 'heal') {
      this.playerSelectedBag = this.player.bag.healingItems;
    }
    else if (itemType === 'pokeball') {
      this.playerSelectedBag = this.player.bag.pokeballs;
    }
    this.setAction(ActionType.SelectItem);
  }

  playerSelectItem(item: Item) {
    this.playerSelectedItem = item;
    this.setAction(ActionType.Item);
  }

  playerUseHealingItem(item: HealingItem, target: Monster) {
    this.player.bag?.useItem(item, target, this.dialogues, this.player);
  }

  playerUsePokeball(item: Pokeball, target: Monster) {
    this.player.bag?.useItem(item, target, this.dialogues, this.player);
    if (this.dialogues.find(dialogue => dialogue === `${target.name} has been caught!`)) {
      this.enemyLost = true;
      this.enemyAction = null;
      this.enemyMonster.hp = 0;
      this.playerMonster.gainEnemyExp(this.enemyMonster, this.dialogues);
      for (const ally of this.player.monsters) {
          if (ally.hp > 0 && ally.specialId !== this.playerMonster.specialId && ally.specialId !== this.player.pokemonId) {
            ally.gainEnemyExp(target, this.dialogues);
          }
        }
    }
  }

  playerRun() {
    this.dialogues.push('You ran away!');
    this.playerLost = true;
  }

  setAction(action: ActionType) {
    if (action === ActionType.SelectAttack || action === ActionType.SelectItem || action === ActionType.SelectItemType || action === ActionType.SelectSwap) {
      this.playerAction = action;
      return;
    }
    if (this.turnEnded){
        this.playerAction = action;
        this.enemyAction = ActionType.Attack;
    }
    else if (this.playerMonster.hp <= 0 && action === ActionType.Swap) {
      this.playerAction = action;
      this.playerTurn();
    }
    this.showMoves = false;
  }
  
  evolveMonster(monster: Monster) {

    const evolution = monster.evolutions[0]?.toPokemon;

    const newMonster = createNewPokemon(evolution, monster.specialId);

    newMonster.specialId = monster.specialId;
    newMonster.level = monster.level;
    newMonster.hp = Math.min(monster.hp, newMonster.maxHp);

    newMonster.calculateExpToNextLevel();
    newMonster.recalculateStats();
    newMonster.checkEvolutionMove();

    newMonster.currentExp = monster.currentExp;
    newMonster.pokemonMoves = [...monster.pokemonMoves];
    newMonster.canEvolve = false;


    const oldMonsterIndex = this.player.monsters.findIndex(
      m => m.specialId === monster.specialId
    );


    this.player.monsters[oldMonsterIndex] = newMonster;

    if (this.playerMonster.specialId === monster.specialId) {
      this.playerMonster = newMonster;
    }

    this.dialogues.push(`${monster.name} evolved into ${newMonster.name}!`);
  }
}