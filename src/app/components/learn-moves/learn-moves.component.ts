import { Component, Input } from '@angular/core';
import { Game } from '../../models/game/game.model';
import { calculateBg } from '../../utils/game.utils';
import { Monster } from '../../models/monster/monster.model';
@Component({
  selector: 'app-learn-moves',
  standalone: true,
  imports: [],
  templateUrl: './learn-moves.component.html',
  styleUrl: './learn-moves.component.scss'
})
export class LearnMovesComponent {
  @Input() game!: Game;
  @Input() monster!: Monster;
  
  calculateBg = calculateBg;
}
