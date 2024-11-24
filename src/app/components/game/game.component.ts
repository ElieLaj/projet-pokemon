import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Monster } from '../../models/monster/monster.model';
import { MonsterDTO } from '../../models/monster/monsterDTO.model';
import { BattleScreenComponent } from '../battle-screen/battle-screen.component';
import { MonsterComponent } from '../monster/monster.component';
import { api } from '../../../plugins/api';
import { transformManyPokemonDTO } from '../../utils/game.utils';
import { Game } from '../../models/game.model';
import { Trainer } from '../../models/trainer.model';
import { Bag } from '../../models/bag.model';
import { HealingItem } from '../../models/healingItem.model';

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

    const healingItem = new HealingItem(1, 'Potion', 'Heals a pokemon', 200, 20, 0);

    this.playerBag = new Bag([healingItem], [])

    this.player = new Trainer('Player', [this.playerMonster], 500, this.playerBag);

    this.game = new Game(this.player, this.enemyMonster);

  }

  gameOver(score: number) {
    this.startBattle = false;
    this.lastScore = score;
    this.playerBag = new Bag([], [])
    this.playerSelectMonster(this.monsters[0]);
  }

  onNextEnemy() {
    const nextEnemy = this.monsters[Math.floor(Math.random() * this.monsters.length)];
    this.game.enemyMonster = nextEnemy;
    this.game.dialogues.push(`A new enemy appears: ${nextEnemy.name}!`);
  }

playerSelectMonster(monster: Monster) {
    const monsterCopy = new Monster(
        monster.id,
        monster.name,
        monster.baseHp,
        monster.baseAttack,
        monster.baseDefense,
        monster.baseSpecialAttack,
        monster.baseSpecialDefense,
        monster.baseSpeed,
        monster.expRate,
        monster.pokemonMoves,
        monster.types,
        monster.level
    );

    this.playerMonster = monsterCopy;

    this.player = new Trainer('Player', [monsterCopy], 500, this.playerBag);

    if (this.game) {
        this.game.player = this.player;
    }
}

  onStartBattle() {
      const selectedMonster = this.playerMonster || this.monsters[0];
      const monsterCopy = new Monster(
          selectedMonster.id,
          selectedMonster.name,
          selectedMonster.baseHp,
          selectedMonster.baseAttack,
          selectedMonster.baseDefense,
          selectedMonster.baseSpecialAttack,
          selectedMonster.baseSpecialDefense,
          selectedMonster.baseSpeed,
          selectedMonster.expRate,
          selectedMonster.pokemonMoves,
          selectedMonster.types,
          selectedMonster.level
      );

      this.player = new Trainer('Player', [monsterCopy], 500, this.playerBag);
      this.game = new Game(this.player, this.enemyMonster);

      this.startBattle = true;
  }

  async fetchMonsters() {
    const monsters = await api.get('pokemon').then((response: any) => {
      return response.data;
    });
    return monsters;
  }

  startBattle = false;
}
