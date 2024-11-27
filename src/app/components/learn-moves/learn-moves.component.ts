import { Component, Input } from '@angular/core';
import { Game } from '../../models/game.model';
import { calculateBg } from '../../utils/game.utils';
@Component({
  selector: 'app-learn-moves',
  standalone: true,
  imports: [],
  templateUrl: './learn-moves.component.html',
  styleUrl: './learn-moves.component.scss'
})
export class LearnMovesComponent {
  @Input() game!: Game;
  
  calculateBg = calculateBg;
}
