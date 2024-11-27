import { ActionType, calculateDamage, TurnType } from "../utils/game.utils";
import { HealingItem } from "./healingItem.model";
import { Item } from "./item.model";
import { Monster } from "./monster/monster.model";
import { Move } from "./monster/move.model";
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

  constructor(player: Trainer, enemyMonster: Monster) {
    this.player = player;
    this.enemyMonster = enemyMonster;
    this.playerMonster = player.monsters[0];

  }

  checkTurn() {
    if(this.turn === TurnType.Dialogue) {
      if (this.dialogues.length === 0) {
        if (this.turnEnded)
          this.turn = this.playerMonster.speed > this.enemyMonster.speed ? TurnType.Player : TurnType.Enemy;
        else {
          this.turn = this.lastTurn === TurnType.Player ? TurnType.Enemy : TurnType.Player;
        }
          
      }
    }
    if (this.playerMonster.hp <= 0 || this.enemyMonster.hp <= 0) {
      if (this.playerMonster.hp <= 0 && this.player.monsters.length === 1) {
        this.dialogues.push('You lost!');
        this.playerLost = true;
      }
      else if (this.player.monsters.length > 1 && this.playerMonster.hp <= 0) {
        this.dialogues.push('Choose another pokemon!');
        this.setAction(ActionType.SelectSwap);
      }
      else {
        if (this.enemyLost) {
          this.dialogues.push('You won!');
          this.playerAction = null;
          this.enemyAction = null;
          this.battleCount++;
          this.enemyLevel = Math.floor(this.battleCount % 3) + 5;
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

  playTurn() {
    if (this.playerAction != ActionType.Attack && this.playerAction != null) {
        this.playerTurn();
    }
    if (this.turn === TurnType.Enemy)
      this.enemyAttack();
    
    else if (this.turn === TurnType.Player) 
      this.playerTurn();
  }

  playerTurn() {
    this.lastTurn = TurnType.Player;
    this.turn = TurnType.Dialogue;
    switch(this.playerAction) {
      case ActionType.Attack:
        this.playerAttack();
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

  playerAttack() {
    this.playerMonster.effect ? this.playerMonster.tryRemovingEffect(this.dialogues) : null;
    const paralyzed = this.playerMonster.effect?.name === 'Paralyzed' && Math.random() < 0.25;
    if (this.playerMonster.effect?.name === 'Sleeping' || this.playerMonster.effect?.name === 'Freezed' || paralyzed) {
      paralyzed ? this.dialogues.push(`${this.playerMonster.name} is still ${this.playerMonster.effect?.name}!`) : this.dialogues.push(`${this.playerMonster.name} is ${this.playerMonster.effect?.name} and couldn't attack!`);
      this.lastTurn = TurnType.Player;
      this.turn = TurnType.Dialogue;
      return;
    }
    calculateDamage(this.playerMonster, this.enemyMonster, this.playerSelectedAttack!, this.dialogues);
    
    this.playerMonster.effect?.damage ? 
      this.playerMonster.hp = Math.max(this.playerMonster.hp - Math.floor(this.playerMonster.maxHp * this.playerMonster.effect.damage), 0)
     :
      null;

    this.playerMonster.sufferEffect(this.dialogues);

    if (this.enemyMonster.hp <= 0 ) {
      this.playerMonster.gainEnemyExp(this.enemyMonster);
      this.enemyLost = true;
      this.enemyAction = null;
      this.playerScore += 100;
    }

    this.playerSelectedAttack = null;
    this.playerAction = null;
  }

  playerChangeMonster(newMonster: Monster) {
    const oldMonster = this.playerMonster;
    this.player.monsters[0] = newMonster;
    const newMonsterIndex = this.player.monsters.findIndex(monster => monster.specialId === newMonster.specialId);
    this.player.monsters[newMonsterIndex] = oldMonster;
    this.playerMonster = newMonster;
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

  enemyAttack() {
    this.enemyMonster.effect ? this.enemyMonster.tryRemovingEffect(this.dialogues) : null;
    const paralyzed = this.enemyMonster.effect?.name === 'Paralyzed' && Math.random() < 0.25;
    if (this.enemyMonster.effect?.name === 'Sleeping' || this.enemyMonster.effect?.name === 'Freezed' || paralyzed) {
      this.dialogues.push(`${this.enemyMonster.name} is still ${this.enemyMonster.effect?.name}!`);
      this.lastTurn = TurnType.Enemy;
      this.turn = TurnType.Dialogue;
      this.enemyAction = null;
      return;
    }
    const enemyMove = this.enemyMonster.pokemonMoves[Math.floor(Math.random() * this.enemyMonster.pokemonMoves.length)].move;
    calculateDamage(this.enemyMonster, this.playerMonster, enemyMove, this.dialogues);
    if (this.playerMonster.hp <= 0) {
      this.enemyMonster.gainEnemyExp(this.playerMonster);
    }
    
    this.enemyMonster.sufferEffect(this.dialogues);

    this.enemyAction = null;
    this.lastTurn = TurnType.Enemy;
    this.turn = TurnType.Dialogue;
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
      this.playerMonster.gainEnemyExp(this.enemyMonster);
    }
  }

  playerRun() {
    this.dialogues.push('You ran away!');
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
    const newMonster = monster.evolutions[0].toPokemon;
    console.log(newMonster);
    newMonster.specialId = monster.specialId;
    newMonster.level = monster.level;
    newMonster.hp = monster.hp;
    newMonster.calculateExpToNextLevel();
    newMonster.recalculateStats();

    newMonster.currentExp = monster.currentExp;
    newMonster.pokemonMoves = monster.pokemonMoves;

    monster = newMonster;
    this.playerMonster = monster;
    this.dialogues.push(`${monster.name} evolved into ${newMonster.name}!`);
  }
}