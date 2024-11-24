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
import { items } from '../../data/items';

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
    this.playerSelectMonster(this.monsters[0]);
    this.enemyMonster = new Monster(this.monsters[enemyIndex].id, this.monsters[enemyIndex].name, this.monsters[enemyIndex].baseHp, this.monsters[enemyIndex].baseAttack, this.monsters[enemyIndex].baseDefense, this.monsters[enemyIndex].baseSpecialAttack, this.monsters[enemyIndex].baseSpecialDefense, this.monsters[enemyIndex].baseSpeed, this.monsters[enemyIndex].expRate, this.monsters[enemyIndex].learnset, this.monsters[enemyIndex].types, this.monsters[enemyIndex].level, this.monsters[enemyIndex].stages, this.monsters[enemyIndex].catchRate);

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
    const nextEnemyCopy = new Monster(
        nextEnemy.id,
        nextEnemy.name,
        nextEnemy.baseHp,
        nextEnemy.baseAttack,
        nextEnemy.baseDefense,
        nextEnemy.baseSpecialAttack,
        nextEnemy.baseSpecialDefense,
        nextEnemy.baseSpeed,
        nextEnemy.expRate,
        nextEnemy.learnset,
        nextEnemy.types,
        nextEnemy.level,
        nextEnemy.stages,
        nextEnemy.catchRate
    );
    this.game.enemyMonster = nextEnemyCopy;
    this.game.dialogues.push(`A new enemy appears: ${nextEnemyCopy.name}!`);
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
        monster.learnset,
        monster.types,
        monster.level,
        monster.stages,
        monster.catchRate
    );

    this.playerMonster = monsterCopy;

    this.player = new Trainer('Player', [monsterCopy], 500, this.playerBag);

    this.game = new Game(this.player, this.enemyMonster);
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
          selectedMonster.learnset,
          selectedMonster.types,
          selectedMonster.level,
          selectedMonster.stages,
          selectedMonster.catchRate
      );

      this.player = new Trainer('Player', [monsterCopy], 500, new Bag([], []));
      this.player.bag.addHealingItem(items.potion, 5);
      this.player.bag.addPokeball(items.pokeball, 10);
      this.player.bag.addPokeball(items.masterBall, 1);
      this.game = new Game(this.player, this.enemyMonster);

      this.startBattle = true;
      this.onNextEnemy();
  }

  async fetchMonsters() {
    const monsters = await api.get('pokemon').then((response: any) => {
      return response.data;
    });
    return monsters;
  }

  startBattle = false;
}
