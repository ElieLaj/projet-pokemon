import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Monster } from '../../models/monster.model';
import { MonsterDTO } from '../../models/monsterDTO.model';
import { BattleScreenComponent } from '../battle-screen/battle-screen.component';
import { Move } from '../../models/move.model';
import { MonsterComponent } from '../monster/monster.component';
import { api } from '../../../plugins/api';
import { transformManyPokemonDTO } from '../../utils/game.utils';
import { Game } from '../../models/game.model';
import { Trainer } from '../../models/trainer.model';
import { Bag } from '../../models/bag.model';

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

  lastScore: number = 0;

  playerMonster!: Monster;
  enemyMonster!: Monster;
  game!: Game;
  player!: Trainer;
  playerBag!: Bag;

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
    const enemyIndex = Math.floor(Math.random() * (this.monsters.length - 1));
    this.playerMonster = this.enemyMonster = new Monster(this.monsters[0].id, this.monsters[0].name, this.monsters[0].baseHp, this.monsters[0].baseAttack, this.monsters[0].baseDefense, this.monsters[0].baseSpecialAttack, this.monsters[0].baseSpecialDefense, this.monsters[0].baseSpeed, this.monsters[0].expRate, this.monsters[0].pokemonMoves, this.monsters[0].types, this.monsters[0].level);;
    this.enemyMonster = new Monster(this.monsters[enemyIndex].id, this.monsters[enemyIndex].name, this.monsters[enemyIndex].baseHp, this.monsters[enemyIndex].baseAttack, this.monsters[enemyIndex].baseDefense, this.monsters[enemyIndex].baseSpecialAttack, this.monsters[enemyIndex].baseSpecialDefense, this.monsters[enemyIndex].baseSpeed, this.monsters[enemyIndex].expRate, this.monsters[enemyIndex].pokemonMoves, this.monsters[enemyIndex].types, this.monsters[enemyIndex].level);

    await this.fetchMoves().then((moves: Move[]) => {
      this.moves = moves;
    });

    this.playerBag = new Bag([], [])
    this.player = new Trainer('Player', [this.playerMonster], 500, this.playerBag);

    this.game = new Game(this.player, this.enemyMonster);

  }

  gameOver(score: number) {
    this.startBattle = false;
    this.lastScore = score;
  }

  nextMonster() {
    const enemyIndex = Math.floor(Math.random() * (this.monsters.length - 1));
    this.enemyMonster = new Monster(this.monsters[enemyIndex].id, this.monsters[enemyIndex].name, this.monsters[enemyIndex].baseHp, this.monsters[enemyIndex].baseAttack, this.monsters[enemyIndex].baseDefense, this.monsters[enemyIndex].baseSpecialAttack, this.monsters[enemyIndex].baseSpecialDefense, this.monsters[enemyIndex].baseSpeed, this.monsters[enemyIndex].expRate, this.monsters[enemyIndex].pokemonMoves, this.monsters[enemyIndex].types, this.monsters[enemyIndex].level);
  }

  playerSelectMonster(monster: Monster) {
    this.playerMonster = new Monster(monster.id, monster.name, monster.baseHp, monster.baseAttack, monster.baseDefense, monster.baseSpecialAttack, monster.baseSpecialDefense, monster.baseSpeed, monster.expRate, monster.pokemonMoves, monster.types, monster.level);
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
