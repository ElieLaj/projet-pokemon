import { Component, Input, model, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { Monster } from '../../models/monster/monster.model';
import { calculateBg } from '../../utils/game.utils';

@Component({
  selector: 'app-monster',
  standalone: true,
  imports: [],
  templateUrl: './monster.component.html',
  styleUrl: './monster.component.scss'
})
export class MonsterComponent implements OnInit, OnChanges {
  @Input() monster!: Monster;
  @Input() isPlayer: boolean = true;
  @Input() active: boolean = false;
  @Input() size: 'small' | 'normal' | 'big' = 'normal';
  @Input() detailsType: 'stage' | 'stats' | 'moves' | null = 'stats';
  @Input() statsType: 'base' | 'current' = 'current';
  
  showStats: boolean = false;

  monsterImage!: string;

  healthBarClass!: string;
  healthColor!: string;

  expBarClass!: string;
  expColor!: string;

  borderColor!: string;
  backgroundColor!: string;

  imageSize!: string;
  componentSize!: string;
  detailsPosition!: string;
  nameSize!: string;
  statSize!: string;

  showHp: boolean = true;
  showExp: boolean = true;

  mouseX: number = 0;
  mouseY: number = 0;

  calculateBg = calculateBg;

  ngOnInit(): void {
    this.monsterImage = 'https://img.pokemondb.net/sprites/black-white/anim/'+ (this.isPlayer ? 'back-' : '') +'normal/'+this.monster.name.toLowerCase()+'.gif';
    this.updateBars();
    this.changeSize();
  }

  ngOnChanges(changes: SimpleChanges): void {
      if (changes['size']) {
          this.changeSize();
      }
  }

  ngDoCheck() {
    this.monsterImage = 'https://img.pokemondb.net/sprites/black-white/anim/'+ (this.isPlayer ? 'back-' : '') +'normal/'+this.monster.name.toLowerCase()+'.gif';
    this.updateBars();
  }
  
  updateMousePosition(event: MouseEvent) {
    this.mouseX = event.clientX;
    this.mouseY = event.clientY;
  }

  changeSize() {
    switch (this.size) {
      case 'small':
          this.imageSize = '75px';
          this.componentSize = '125px';
          this.nameSize = '1rem';
          this.statSize = '13px';
          break;
      case 'normal':
          this.imageSize = '120px';
          this.componentSize = '250px';
          this.nameSize = '1.5rem';
          this.statSize = '1rem';
          break;
      case 'big':
          this.imageSize = '200px';
          this.componentSize = '400px';
          this.nameSize = '2rem';
          this.statSize = '1.5rem';
          break;
    }
  }
  

  getBorderColor(): string {
    const color = calculateBg(this.monster.types[0].name);
    return this.active ? '2px solid ' + color : '2px solid';
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
}
