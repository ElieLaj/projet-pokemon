import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { MonsterComponent } from '../monster/monster.component';
import { MonsterDTO } from '../../models/monster/monsterDTO.model';
 
@Component({
  selector: 'app-pokemon-display',
  templateUrl: './pokemon-display.component.html',
  styleUrls: ['./pokemon-display.component.scss'],
  imports: [MonsterComponent],
  standalone: true
})
export class PokemonDisplayComponent {
  @Input() monsters: any[] = [];
  @Input() maxPokemonSize: 'small' | 'normal' | 'big' = 'small';
  @Input() maxContainerWidth: string = '100%';
  @Input() maxContainerHeight: string = 'auto';
  @Input() detailsType: 'stage' | 'stats' | 'moves' | null = 'stats';
  @Output() selectMonster: EventEmitter<MonsterDTO> = new EventEmitter(); 

  playerMonster: any = null;
  hoverMonster: number | null = null;

  updateSelectedMonster(monster: MonsterDTO) {
    this.selectMonster.emit(monster);
    this.playerMonster = monster;
  }
}
