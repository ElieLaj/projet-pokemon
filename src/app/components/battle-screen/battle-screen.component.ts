import { Component, Input, OnInit, Output, EventEmitter, SimpleChanges } from '@angular/core';
import { Monster } from '../../models/monster.model';
import { MonsterComponent } from '../monster/monster.component';
import { TurnType, ActionType, calculateAttackBg, calculateDamage, calculateModifier, triggerEffect } from '../../utils/game.utils';
import { DialogueComponent } from "../dialogue/dialogue.component";
import { Move } from '../../models/move.model';

@Component({
  selector: 'app-battle-screen',
  standalone: true,
  imports: [MonsterComponent, DialogueComponent],
  templateUrl: './battle-screen.component.html',
  styleUrl: './battle-screen.component.scss'
})
export class BattleScreenComponent implements OnInit {
  calculateAttackBg = calculateAttackBg;

  @Input() playerMonster!: Monster;
  @Input() enemyMonster!: Monster;

  @Output() changeEnemyMonster = new EventEmitter<any>();
  @Output() playerLost = new EventEmitter<number>();

  TurnType = TurnType;
  ActionType = ActionType;

  currentTurn: number = 0;

  playerScore: number = 0;

  lastTurn!: TurnType;
  turn: TurnType = TurnType.Dialogue;
  playerAction: ActionType | null = null;
  enemyAction: ActionType | null = null;
  turnEnded: boolean = true;
  playerSelectedAttack: Move | null = null;
  enemySelectAttack: Move | null = null;

  showMoves: boolean = false;

  dialogues: string[] = ['A wild monster appeared!'];

  ngOnInit() {
    this.turn = TurnType.Dialogue;
  }

  ngDoCheck() {
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
        this.playerLost.emit(this.playerScore += 100);
      }
      else {
        this.dialogues.push('You won!');
        this.changeEnemyMonster.emit();
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
    this.lastTurn = TurnType.Player;
    this.playerAction = null;
    this.currentTurn++;
  }

  setAction(action: ActionType) {
    if (this.turnEnded){
        this.playerAction = action;
        this.enemyAction = ActionType.Attack;
    }
    this.showMoves = false;
  }

  playerRun() {
    this.dialogues.push('You ran away!');
  }

  playerSwap() {
    this.dialogues.push('You swapped monsters!');
  }

  playerHeal() {
    this.playerMonster.heal(10);
    this.dialogues.push(`${this.playerMonster.name} healed 10 hp!`);
    this.lastTurn = TurnType.Player;
  }

  playerAttack(){    
    calculateDamage(this.playerMonster, this.enemyMonster, this.playerSelectedAttack!, this.dialogues);
    
    this.lastTurn = TurnType.Player;
    this.turn = TurnType.Dialogue;

    this.playerSelectedAttack = null;
    this.playerAction = null;
    
    if (this.enemyMonster.hp <= 0 ) {
      this.playerMonster.gainEnemyExp(this.enemyMonster);
      this.enemyAction = null;
      this.enemySelectAttack = null;
      this.playerScore += 100;
    }
  }


  enemyAttack(){
    console.log(this.enemyMonster);
    this.enemySelectAttack = this.enemyMonster.pokemonMoves[Math.floor(Math.random() * this.enemyMonster.pokemonMoves.length)].move;
    
    calculateDamage(this.enemyMonster, this.playerMonster, this.enemySelectAttack!, this.dialogues);

    this.lastTurn = TurnType.Enemy;
    this.turn = TurnType.Dialogue;

    this.enemyAction = null;

    this.enemySelectAttack = null;
  }
}
