import { ActionType, calculateDamage, TurnType } from "../utils/game.utils";
import { Monster } from "./monster.model";
import { Move } from "./move.model";
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
  enemySelectedAttack: Move | null = null;

  playerAction: ActionType | null = null;
  enemyAction: ActionType | null = null;

  playerMonster: Monster;

  playerScore: number = 0;
  playerLost: boolean = false;
  enemyLost: boolean = false;

  currentTurn: number = 0;
  
  battleNumber: number = 0;

  showMoves: boolean = false;

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
      if (this.playerMonster.hp <= 0) {
        this.dialogues.push('You lost!');
        this.playerLost = true;
      }
      else {
        this.dialogues.push('You won!');
        this.enemyLost = true;
      }
      this.turn = TurnType.Dialogue;
    }

    else if (this.playerAction != null || this.enemyAction != null) {
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
    this.lastTurn = this.turn;
    this.turn = TurnType.Dialogue;
    switch(this.playerAction) {
      case ActionType.Attack:
        this.playerAttack();
        break;
      case ActionType.Item:
        this.playerHeal();
        break;
      case ActionType.Swap:
        this.playerSwap();
        break;
      case ActionType.Run:
        this.playerRun();
        break;
    }
    this.playerAction = null;
    this.currentTurn++;
  }

  playerAttack() {
    calculateDamage(this.playerMonster, this.enemyMonster, this.playerSelectedAttack!, this.dialogues);
    if (this.enemyMonster.hp <= 0 ) {
      this.playerMonster.gainEnemyExp(this.enemyMonster);
      this.enemyAction = null;
      this.enemySelectedAttack = null;
      this.playerScore += 100;
    }
  }

  enemyAttack() {
    const enemyMove = this.enemyMonster.pokemonMoves[Math.floor(Math.random() * this.enemyMonster.pokemonMoves.length)].move;
    calculateDamage(this.enemyMonster, this.playerMonster, enemyMove, this.dialogues);
    if (this.playerMonster.hp <= 0) {
      this.enemyMonster.gainEnemyExp(this.playerMonster);
      this.playerAction = null;
      this.playerSelectedAttack = null;
    }
  }

  playerHeal() {
    this.playerMonster.heal(10);
  }

  playerSwap() {
    this.playerMonster = this.player.monsters[1];
  }

  playerRun() {
    this.dialogues.push('You ran away!');
  }

  setAction(action: ActionType) {
    if (this.turnEnded){
        this.playerAction = action;
        this.enemyAction = ActionType.Attack;
    }
    this.showMoves = false;
  }
  
}