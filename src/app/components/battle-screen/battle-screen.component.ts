import { Component, Input, OnInit, Output, EventEmitter, SimpleChanges } from '@angular/core';
import { Monster } from '../../models/monster.model';
import { MonsterComponent } from '../monster/monster.component';
import { TurnType, ActionType, calculateBg, calculateDamage, calculateModifier, triggerEffect } from '../../utils/game.utils';
import { DialogueComponent } from "../dialogue/dialogue.component";
import { Move } from '../../models/move.model';
import { Game } from '../../models/game.model';

@Component({
  selector: 'app-battle-screen',
  standalone: true,
  imports: [MonsterComponent, DialogueComponent],
  templateUrl: './battle-screen.component.html',
  styleUrl: './battle-screen.component.scss'
})
export class BattleScreenComponent implements OnInit {
  calculateBg = calculateBg;

  @Input() game!: Game;


  @Output() changeEnemyMonster = new EventEmitter<any>();
  @Output() playerLost = new EventEmitter<number>();


  ngOnInit() {
    if (this.game.dialogues.length === 0) {
      this.game.dialogues.push('A wild monster appeared!');
    }
  }

  ngDoCheck() {
    this.game.checkTurn();
  }

  setPlayerAction(action: ActionType) {
    this.game.setAction(action);
    this.handleNextTurn(); 
  }

  handleNextTurn() {
    this.game.checkTurn();

    if (this.game.playerLost) {
      this.playerLost.emit(this.game.playerScore);
    } else if (this.game.enemyLost) {
      this.changeEnemyMonster.emit();
    }
  }
}
