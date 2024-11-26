import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Monster } from '../../models/monster/monster.model';
import { MonsterDTO } from '../../models/monster/monsterDTO.model';
import { BattleScreenComponent } from '../battle-screen/battle-screen.component';
import { MonsterComponent } from '../monster/monster.component';
import { api } from '../../../plugins/api';
import { transformManyPokemonDTO, transformManyPokemonEvolutionDTO } from '../../utils/game.utils';
import { Game } from '../../models/game.model';
import { Trainer } from '../../models/trainer.model';
import { Bag } from '../../models/bag.model';
import { items } from '../../data/items';
import { Stage } from '../../models/stage.model';
import { DisplayStageComponent } from '../display-stage/display-stage.component';
import { forkJoin } from 'rxjs';
import { PokemonDisplayComponent } from '../pokemon-display/pokemon-display.component';

@Component({
  selector: 'app-game',
  standalone: true,
  imports: [BattleScreenComponent, MonsterComponent, FormsModule, DisplayStageComponent, PokemonDisplayComponent],
  templateUrl: './game.component.html',
  styleUrl: './game.component.scss'
})

export class GameComponent implements OnInit {
  currentYear!: number;

  monstersDTO: MonsterDTO[] = [];
  monsters: Monster[] = [];
  spawnableMonsters: Monster[] = []
  stages: Stage[] = [];

  currentStage!: Stage;

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
    forkJoin([
    this.fetchMonsters(),
    this.fetchStages()
  ]).subscribe(
    ([monsters, stages]) => {
      const evolutions = monsters.map((monster: MonsterDTO) => monster.evolutions[0]?.toPokemon.id).filter((id: number) => id !== undefined);
      this.monsters = transformManyPokemonDTO(monsters.filter((monster: MonsterDTO) => !evolutions.includes(monster.id)));
      this.stages = stages;
    },
    error => {
      console.error('Error fetching data', error);
    })
  }

  ngDoCheck() {
    if(this.monsters && this.stages) {
      this.createGame
    }
  }

  gameOver(score: number) {
    this.startBattle = false;
    this.lastScore = score;
    this.playerBag = new Bag([], [])
    this.playerSelectMonster(this.monsters[0]);
  }

  createGame() {
    const stageIndex = Math.floor(Math.random() * (this.stages.length - 1));
    this.currentStage = this.stages[stageIndex];
    this.spawnableMonsters = transformManyPokemonDTO(this.currentStage?.pokemons);
    const enemyIndex = Math.floor(Math.random() * (this.spawnableMonsters.length - 1));
    this.playerSelectMonster(this.monsters[0]);

    this.enemyMonster = new Monster(
      this.spawnableMonsters[enemyIndex].id,
      this.spawnableMonsters[enemyIndex].name, 
      this.spawnableMonsters[enemyIndex].baseHp, 
      this.spawnableMonsters[enemyIndex].baseAttack, 
      this.spawnableMonsters[enemyIndex].baseDefense, 
      this.spawnableMonsters[enemyIndex].baseSpecialAttack, 
      this.spawnableMonsters[enemyIndex].baseSpecialDefense, 
      this.spawnableMonsters[enemyIndex].baseSpeed, 
      this.spawnableMonsters[enemyIndex].expRate, 
      this.spawnableMonsters[enemyIndex].learnset, 
      this.spawnableMonsters[enemyIndex].types, 
      this.spawnableMonsters[enemyIndex].level, 
      this.spawnableMonsters[enemyIndex].stages, 
      this.spawnableMonsters[enemyIndex].catchRate,
      this.spawnableMonsters[enemyIndex].evolutions
    );

    this.game = new Game(this.player, this.enemyMonster);
    this.game.stage = this.currentStage;
  }

  onNextEnemy() {
    const nextEnemy = this.spawnableMonsters[Math.floor(Math.random() * this.spawnableMonsters.length)];
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
        nextEnemy.catchRate,
        nextEnemy.evolutions
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
        monster.catchRate,
        monster.evolutions
    );

    this.playerMonster = monsterCopy;

    this.player = new Trainer('Player', [monsterCopy], 500, this.playerBag);

    this.game = new Game(this.player, this.enemyMonster);
    this.game.stage = this.currentStage;
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
          selectedMonster.catchRate,
          selectedMonster.evolutions
      );

      this.player = new Trainer('Player', [monsterCopy], 500, new Bag([], []));
      this.player.bag.addHealingItem(items.potion, 5);
      this.player.bag.addPokeball(items.pokeball, 10);
      this.player.bag.addPokeball(items.masterBall, 1);
      this.game = new Game(this.player, this.enemyMonster);
      this.game.stage = this.currentStage;

      this.startBattle = true;
      this.onNextEnemy();
  }

  async fetchMonsters(): Promise<MonsterDTO[]> {
    const monsters = await api.get('pokemon').then((response: any) => {
      return response.data;
    });
    return monsters;
  }

  async fetchStages(): Promise<Stage[]> {
    const stages = await api.get('stage').then((response: any) => {
      return response.data
    })
    return stages
  }
  startBattle = false;
}


