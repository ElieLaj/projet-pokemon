import { Component } from '@angular/core';
import { Monster } from '../../models/monster.model';
import { BattleScreenComponent } from '../battle-screen/battle-screen.component';
import { Game } from '../../models/game.model';
import { Attack } from '../../models/attack.model';
import { MonsterComponent } from '../monster/monster.component';
@Component({
  selector: 'app-game',
  standalone: true,
  imports: [BattleScreenComponent, MonsterComponent],
  templateUrl: './game.component.html',
  styleUrl: './game.component.scss'
})
export class GameComponent {
  scratch = new Attack('Scratch', 10, 'Normal');
  playerMonster = new Monster(1, 'Bulbasaur', 'Grass', 100, 25, 15, [this.scratch]);
  enemyMonster = new Monster(2, 'Charmander', 'Fire', 100, 25, 13, [this.scratch]);
  currentYear!: number;

  constructor() {
    this.currentYear = new Date().getFullYear();
  }

  startBattle = false;
}
