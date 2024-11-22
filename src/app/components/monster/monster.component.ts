import { Component, Input, model, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { Monster } from '../../models/monster.model';
import { calculateAttackBg } from '../../utils/game.utils';

@Component({
  selector: 'app-monster',
  standalone: true,
  imports: [],
  templateUrl: './monster.component.html',
  styleUrl: './monster.component.scss'
})
export class MonsterComponent implements OnInit {
  @Input() monster!: Monster;
  @Input() isPlayer: boolean = true;
  @Input() active: boolean = false;

  showStats: boolean = false;

  monsterImage!: string;

  healthBarClass!: string;
  healthColor!: string;

  expBarClass!: string;
  expColor!: string;

  borderColor!: string;
  backgroundColor!: string;

  calculateAttackBg = calculateAttackBg;


  getBorderColor(): string {
    const color = calculateAttackBg(this.monster.types[0].name);
    return this.active ? '4px solid ' + color : '2px solid';
  }

  getHpBarColor(): string {
    const hpPercentage = this.monster.hp/this.monster.maxHp*100;

    if (hpPercentage > 50) {
        return 'linear-gradient(90deg, #4caf50, #81c784)';
    } else if (hpPercentage > 20) {
        return 'linear-gradient(90deg, #ff9800, #ffb74d)';
    } else {
        return 'linear-gradient(90deg, #f44336, #ef5350)';
    }
  }

  getExpBarColor(): string {
    const expPercentage = this.monster.currentExp/this.monster.neededExp*100;

    if (expPercentage > 50) {
        return 'linear-gradient(90deg, #2196f3, #3f51b5)';
    } else if (expPercentage > 20) {
        return 'linear-gradient(90deg, #64b5f6, #5c6bc0)';
    } else {
        return 'linear-gradient(90deg, #bbdefb, #7e57c2)';
    }
  }

  updateBars() {
    this.borderColor = this.getBorderColor();
    this.healthBarClass = this.monster.hp/this.monster.maxHp*100 + '%';
    this.healthColor = this.getHpBarColor();
    this.expBarClass = this.monster.currentExp/this.monster.neededExp*100 + '%';
    this.expColor = this.getExpBarColor();
  }

  ngOnInit(): void {
    this.monsterImage = 'https://img.pokemondb.net/sprites/black-white/anim/'+ (this.isPlayer ? 'back-' : '') +'normal/'+this.monster.name.toLowerCase()+'.gif';
    this.updateBars();
  }

  ngDoCheck() {
    this.monsterImage = 'https://img.pokemondb.net/sprites/black-white/anim/'+ (this.isPlayer ? 'back-' : '') +'normal/'+this.monster.name.toLowerCase()+'.gif';
    this.updateBars();
  }
}
