import { Component, OnInit } from '@angular/core';
import { Monster } from '../../models/monster.model';
import { MonsterDTO } from '../../models/monsterDTO.model';
import { BattleScreenComponent } from '../battle-screen/battle-screen.component';
import { Move } from '../../models/move.model';
import { MonsterComponent } from '../monster/monster.component';
import { api } from '../../../plugins/api';

@Component({
  selector: 'app-game',
  standalone: true,
  imports: [BattleScreenComponent, MonsterComponent],
  templateUrl: './game.component.html',
  styleUrl: './game.component.scss'
})

export class GameComponent implements OnInit {
  currentYear!: number;
  monstersDTO: MonsterDTO[] = [];
  monsters: Monster[] = [];
  playerMonster!: Monster;
  enemyMonster!: Monster;
  constructor() {
    this.currentYear = new Date().getFullYear();

  }

  async ngOnInit() { 
    await this.fetchMonsters().then((monsters: MonsterDTO[]) => {
      this.monstersDTO = monsters;
    });
    this.monsters = this.monstersDTO.map((monster: MonsterDTO) => {
      return new Monster(
        monster.id,
        monster.name,
        monster.hp,
        monster.attack,
        monster.defense,
        monster.specialAttack,
        monster.specialDefense,
        monster.speed,
        monster.expRate,
        monster.pokemonMoves,
        monster.types
      );
    });
    console.log(this.monsters);
    this.playerMonster = this.monsters[0];
    this.enemyMonster = this.monsters[1];
  }

  async fetchMonsters() {
    const monsters = await api.get('pokemon').then((response: any) => {
      return response.data;
    });
    return monsters;
  }

  startBattle = false;
}
