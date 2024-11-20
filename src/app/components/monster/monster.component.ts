import { Component, Input, model, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { Monster } from '../../models/monster.model';

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

  monsterImage!: string;
  healthBarClass!: string;
  healthColor!: string;

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

  ngOnInit(): void {
    this.monsterImage = `img/${this.monster.name.toLowerCase()}${this.isPlayer ? '-back' : ''}.gif`;
    this.healthBarClass = this.monster.hp/this.monster.maxHp*100 + '%';
    this.healthColor = this.getHpBarColor();
  }

  ngDoCheck() {
    this.monsterImage = `img/${this.monster.name.toLowerCase()}${this.isPlayer ? '-back' : ''}.gif`;
    this.healthBarClass = this.monster.hp/this.monster.maxHp*100 + '%';
    this.healthColor = this.getHpBarColor();
  }
}
