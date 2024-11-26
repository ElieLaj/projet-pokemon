import { Component, Input, OnInit, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { MonsterComponent } from '../monster/monster.component';
import { MonsterDTO } from '../../models/monster/monsterDTO.model';
import { Monster } from '../../models/monster/monster.model';
 
@Component({
  selector: 'app-pokemon-display',
  templateUrl: './pokemon-display.component.html',
  styleUrls: ['./pokemon-display.component.scss'],
  imports: [MonsterComponent],
  standalone: true
})
export class PokemonDisplayComponent implements OnChanges {
  @Input() monsters: Monster[] = [];
  @Input() maxPokemonSize: 'small' | 'normal' | 'big' = 'small';
  @Input() maxContainerWidth: string = '100%';
  @Input() maxContainerHeight: string = 'auto';
  @Input() detailsType: 'stage' | 'stats' | 'moves' | null = 'stats';
  @Input() style: 'dark' | 'light' = 'light';
  @Input() statsType: 'base' | 'current' = "current";

  @Output() selectMonster: EventEmitter<Monster> = new EventEmitter(); 

  playerMonster: any = null;
  hoverMonster: number | null = null;

  backgroundColor: string = 'white';

  constructor() { 
    this.style === 'light' ? this.backgroundColor = '#f9f9f9' : this.backgroundColor = '#2a2a3e';
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.style === 'light' ? this.backgroundColor = '#f9f9f9' : this.backgroundColor = '#2a2a3e';
  }

  updateSelectedMonster(monster: Monster) {
    this.selectMonster.emit(monster);
    this.playerMonster = monster;
  }
}
