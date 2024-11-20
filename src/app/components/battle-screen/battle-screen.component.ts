import { Component, Input, OnInit, Output, EventEmitter, SimpleChanges } from '@angular/core';
import { Monster } from '../../models/monster.model';
import { MonsterComponent } from '../monster/monster.component';
import { TurnType, ActionType } from '../../utils/game.utils';
import { DialogueComponent } from "../dialogue/dialogue.component";
import { Attack } from '../../models/attack.model';

@Component({
  selector: 'app-battle-screen',
  standalone: true,
  imports: [MonsterComponent, DialogueComponent],
  templateUrl: './battle-screen.component.html',
  styleUrl: './battle-screen.component.scss'
})
export class BattleScreenComponent implements OnInit {

  @Input() playerMonster!: Monster;
  @Input() enemyMonster!: Monster;

  @Output() playerMonsterChange = new EventEmitter<Monster>();

  TurnType = TurnType;
  ActionType = ActionType;

  lastTurn!: TurnType;
  turn: TurnType = TurnType.Dialogue;
  playerAction: ActionType | null = null;
  enemyAction: ActionType | null = null;
  turnEnded: boolean = true;
  playerSelectAttack: Attack | null = null;
  enemySelectAttack: Attack | null = null;

  dialogues: string[] = ['A wild monster appeared!'];


  ngOnInit() {
    this.turn = TurnType.Dialogue;
    this.lastTurn = this.playerMonster.speed < this.enemyMonster.speed ? TurnType.Player : TurnType.Enemy;
  }

  ngDoCheck() {
    if(this.turn === TurnType.Dialogue) {
      if (this.dialogues.length === 0) {
        if (this.turnEnded)
          this.turn = this.playerMonster.speed > this.enemyMonster.speed ? TurnType.Player : TurnType.Enemy;
        else
          this.turn = this.lastTurn === TurnType.Player ? TurnType.Enemy : TurnType.Player;
      }
    }
    if (this.playerMonster.hp <= 0 || this.enemyMonster.hp <= 0) { 
      this.dialogues.push('Battle ended!');
      this.turn = TurnType.Dialogue;
      this.playerMonsterChange.emit(this.playerMonster);
    }

    else if (((this.playerAction != null && this.playerAction != ActionType.Attack) || this.playerSelectAttack) || this.enemyAction != null) {
        this.turnEnded = false;
        this.playTurn();
    }
    else this.turnEnded = true;
  }

  playTurn() {
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
      case ActionType.Heal:
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
  }

  setAction(action: ActionType) {
    if (this.turnEnded){
        this.playerAction = action;
        if (action != ActionType.Attack)
          this.enemyAction = ActionType.Attack;
    }
  }

  playerRun() {
    this.dialogues.push('You ran away!');
  }

  playerSwap() {
    this.dialogues.push('You swapped monsters!');
  }

  playerHeal() {
    this.playerMonster.hp += 10;
    this.dialogues.push(`${this.playerMonster.name} healed 10 hp!`);
  }

  playerAttack(){
    const damage = this.playerMonster.attack + this.playerSelectAttack!.damage;
    this.enemyMonster.hp = Math.max(this.enemyMonster.hp - damage, 0);
    this.lastTurn = TurnType.Player;
    this.turn = TurnType.Dialogue;
    this.playerSelectAttack = null;
    this.playerAction = null;
    this.dialogues.push(`${this.playerMonster.name} attacked ${this.enemyMonster.name} and dealt ${damage}!`);
  }


  enemyAttack(){
    this.enemySelectAttack = this.enemyMonster.attacks[Math.floor(Math.random() * this.enemyMonster.attacks.length)];
    const damage = this.playerMonster.attack + this.enemySelectAttack.damage;
        console.log(damage);
    this.playerMonster.hp = Math.max(this.playerMonster.hp - damage, 0);
    this.lastTurn = TurnType.Enemy;
    this.turn = TurnType.Dialogue;
    this.dialogues.push(`${this.enemyMonster.name} attacked ${this.playerMonster.name} and dealt ${damage}!`);
    this.enemyAction = null;
    this.enemySelectAttack = null;
  }
}
