import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Monster } from '../../models/monster/monster.model';
import { MonsterDTO } from '../../models/monster/monsterDTO.model';
import { BattleScreenComponent } from '../battle-screen/battle-screen.component';
import { MonsterComponent } from '../monster/monster.component';
import { api } from '../../../plugins/api';
import { transformManyPokemonDTO, transformManyPokemonEvolutionDTO, createNewPokemon, transformStageDTO } from '../../utils/game.utils';
import { Game } from '../../models/game.model';
import { Trainer } from '../../models/trainer.model';
import { Bag } from '../../models/bag.model';
import { Stage } from '../../models/stage.model';
import { DisplayStageComponent } from '../display-stage/display-stage.component';
import { forkJoin } from 'rxjs';
import { PokemonDisplayComponent } from '../pokemon-display/pokemon-display.component';
import { Pokeball } from '../../models/pokeball.model';
import { HealingItem } from '../../models/healingItem.model';
import { StageDTO } from '../../models/stageDTO.model';
import { Evolution } from '../../models/monster/evolution.model';

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
  middleStageMonsters: Monster[] = [];

  stages: StageDTO[] = [];
  pokeballs: Pokeball[] = [];
  healingItems: HealingItem[] = [];

  currentStage!: Stage;

  hoverMonster: number | null = null;

  lastScore: number = 0;

  playerMonsters: Monster[] = [];
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
    this.fetchStages(),
    this.fetchPokeball(),
    this.fetchHealingItem()
  ]).subscribe(
    ([monsters, stages, pokeballs, healingItems]) => {
      const evolutions = monsters.map((monster: MonsterDTO) => monster.evolutions[0]?.toPokemon.id).filter((id: number) => id !== undefined);

      this.monsters = transformManyPokemonDTO([...monsters].filter((monster: MonsterDTO) => !evolutions.includes(monster.id)));
      this.stages = stages;
      this.pokeballs = pokeballs;
      this.healingItems = healingItems;


      this.createGame(stages);
      },
    error => {
      console.error('Error fetching data', error);
    })
  }

  gameOver(score: number) {
    this.startBattle = false;
    this.lastScore = score;
    this.playerBag = new Bag([], [])
  }

  createGame(stages: StageDTO[]) {
    let stageIndex = Math.floor(Math.random() * stages.length);
    while (stages[stageIndex].pokemons.length === 0) {
      stageIndex = Math.floor(Math.random() * stages.length);
    }
    const selectedStageDTO = stages[stageIndex];

    this.currentStage = transformStageDTO(selectedStageDTO);

    const evolutions = this.currentStage.pokemons.map((monster: Monster) => monster.evolutions[0]?.toPokemon.id).filter((id: number) => id !== undefined);

    this.spawnableMonsters = this.currentStage?.pokemons.filter(
      (monster: Monster) => !evolutions.includes(monster.id)
    );

    const enemyIndex = Math.floor(Math.random() * (this.spawnableMonsters.length - 1));

    if (this.spawnableMonsters[enemyIndex]) {
      this.enemyMonster = createNewPokemon(this.spawnableMonsters[enemyIndex], null, this.game?.enemyLevel || 1);
    }

    this.player = new Trainer('Player', this.playerMonsters, 500, this.playerBag);

    this.game = new Game(this.player, this.enemyMonster);
    this.game.balls = [...this.pokeballs];
    this.game.hItems = [...this.healingItems];
    this.game.stage = this.currentStage;

    this.game.stage.pokemons = [...this.spawnableMonsters];
  }

  onNextEnemy() {
    if (this.game.battleCount % 6 === 0) {
      const stageIndex = Math.floor(Math.random() * this.stages.length);
      this.currentStage = transformStageDTO(this.stages[stageIndex]);
      this.game.stage = this.currentStage;
      const evolutions = this.currentStage.pokemons.map((monster: Monster) => monster.evolutions[0]?.toPokemon.id).filter((id: number) => id !== undefined);

      this.spawnableMonsters = this.currentStage?.pokemons.filter(
        (monster: Monster) => !evolutions.includes(monster.id)
      );
    }

    const evolutions = [...this.game.stage.pokemons].map((monster: Monster) => monster.evolutions[0]).filter((evo: Evolution) => evo !== undefined && evo.levelRequired <= this.game.enemyLevel);
    this.middleStageMonsters = evolutions.map((evo: Evolution) => evo.toPokemon);

    const evolvedMonsters = this.middleStageMonsters.filter(
      (monster: Monster) =>
      !this.spawnableMonsters.find((m: Monster) => m.id === monster.id)
    );

   this.spawnableMonsters = [...this.spawnableMonsters, ...(evolvedMonsters)];

   this.game.stage.pokemons = [...this.spawnableMonsters];

    const nextEnemy = this.spawnableMonsters[Math.floor(Math.random() * this.spawnableMonsters.length)];
    const nextEnemyCopy = createNewPokemon(nextEnemy, null, this.game.enemyLevel);

    this.game.enemyMonster = nextEnemyCopy;
    this.game.dialogues.push(`A new enemy appears: ${nextEnemyCopy.name}!`);
  }

  playerSelectMonster(monster: Monster) {
    const monsterCopy = createNewPokemon(monster);

    if (this.playerMonsters.map((m: Monster) => m.id).includes(monsterCopy.id)) {
      return;
    }

    if (this.playerMonsters.length < 2) {
      this.playerMonsters.push(monsterCopy);
    } else {
      this.playerMonsters[0] = createNewPokemon(this.playerMonsters[1]);
      this.playerMonsters[1] = monsterCopy;
    }

    this.player = new Trainer('Player', this.playerMonsters, 500, this.playerBag);

    this.game = new Game(this.player, this.enemyMonster);
    this.game.stage = this.currentStage;
  }

  playerUnselectMonster(monster: Monster) {
    this.playerMonsters = this.playerMonsters.filter((m: Monster) => m.id !== monster.id);
    this.player = new Trainer('Player', this.playerMonsters, 500, this.playerBag);

    this.game = new Game(this.player, this.enemyMonster);
    this.game.stage = this.currentStage;
  }


  onStartBattle() {
      const selectedMonsters = this.playerMonsters || [this.monsters[0], this.monsters[1]];

      this.player = new Trainer('Player', [...selectedMonsters], 500, new Bag([], []));
      this.player.bag.addHealingItem(this.healingItems.sort((a, b) => a.healAmount - b.healAmount)[0], 5);
      this.player.bag.addPokeball(this.pokeballs.sort((a, b) => a.catchRate - b.catchRate)[0], 10);
      this.game = new Game(this.player, this.enemyMonster);
      this.game.stage = this.currentStage;
      this.game.balls = [...this.pokeballs];
      this.game.hItems = [...this.healingItems];
      this.startBattle = true;

      this.onNextEnemy();
  }

  async fetchMonsters(): Promise<MonsterDTO[]> {
    const monsters = await api.get('pokemon').then((response: any) => {
      return response.data;
    });
    return monsters;
  }

    async fetchPokeball(): Promise<Pokeball[]> {
    const pokeballs = await api.get('pokeball').then((response: any) => {
      return response.data;
    });
    return pokeballs;
  }

    async fetchHealingItem(): Promise<HealingItem[]> {
    const healingItems = await api.get('healingItem').then((response: any) => {
      return response.data;
    });
    return healingItems;
  }

  async fetchStages(): Promise<StageDTO[]> {
    const stages = await api.get('stage').then((response: any) => {
      return response.data
    })
    return stages
  }
  startBattle = false;
}


