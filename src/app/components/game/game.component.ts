import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Monster } from '../../models/monster.model';
import { MonsterDTO } from '../../models/monsterDTO.model';
import { BattleScreenComponent } from '../battle-screen/battle-screen.component';
import { Move } from '../../models/move.model';
import { MonsterComponent } from '../monster/monster.component';
import { api } from '../../../plugins/api';
import { transformManyPokemonDTO } from '../../utils/game.utils';

@Component({
  selector: 'app-game',
  standalone: true,
  imports: [BattleScreenComponent, MonsterComponent, FormsModule],
  templateUrl: './game.component.html',
  styleUrl: './game.component.scss'
})

export class GameComponent implements OnInit {
  currentYear!: number;

  monstersDTO: MonsterDTO[] = [];
  monsters: Monster[] = [];
  hoverMonster: number | null = null;

  playerMonster!: Monster;
  enemyMonster!: Monster;

  moves: Move[] = [];
  selectedMove!: Move;
  constructor() {
    this.currentYear = new Date().getFullYear();
  }

  async ngOnInit() { 
    await this.fetchMonsters().then((monsters: MonsterDTO[]) => {
      this.monstersDTO = monsters;
    });
    this.monsters = transformManyPokemonDTO(this.monstersDTO);
    this.playerMonster = this.monsters[0];
    this.enemyMonster = this.monsters[1];

    await this.fetchMoves().then((moves: Move[]) => {
      this.moves = moves;
    });

  }

async addSelectedMove() {
  try {
    const response = await api.post('pokemon_move', {
      moveName: this.selectedMove,
      pokemonName: this.playerMonster.name,
      level: this.playerMonster.level
    });
    
    console.log(response.data);
  } catch (error) {
    console.error('Error adding move:', error);
  }
}

  async fetchMoves() {
    const moves = await api.get('move').then((response: any) => {
      return response.data;
    });
    return moves;
  }

  async fetchMonsters() {
    const monsters = await api.get('pokemon').then((response: any) => {
      return response.data;
    });
    return monsters;
  }

  startBattle = false;
}
