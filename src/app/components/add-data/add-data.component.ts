import { Component, effect, OnInit } from '@angular/core';
import { api } from '../../../plugins/api';
import { FormGroup, Validators, ReactiveFormsModule, FormBuilder, FormsModule } from '@angular/forms';
import { Type } from '../../models/monster/type.model';
import { calculateBg } from '../../utils/game.utils';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { Monster } from '../../models/monster/monster.model';
import { MonsterDTO } from '../../models/monster/monsterDTO.model';
import { MonsterComponent } from '../monster/monster.component';
import { Move } from '../../models/monster/move.model';
import { PokemonDisplayComponent } from '../pokemon-display/pokemon-display.component';
import { Category } from '../../models/category.model';
import { Effect } from '../../models/monster/effect.model';
import { Stage } from '../../models/stage.model';
import { forkJoin } from 'rxjs';
import { transformManyPokemonDTO } from '../../utils/game.utils';

@Component({
  selector: 'app-add-data',
  standalone: true,
  imports: [ReactiveFormsModule, MonsterComponent, PokemonDisplayComponent, FormsModule],
  templateUrl: './add-data.component.html',
  styleUrl: './add-data.component.scss',
  animations: [
    trigger('formState', [
      state('open', style({
        opacity: 1,
        maxHeight: '1000px',
        padding: '20px'
      })),
      state('closed', style({
        opacity: 0,
        maxHeight: '0',
        padding: '0'
      })),
      transition('open <=> closed', [
        animate('0.5s ease-out')
      ])
    ])
  ]
})
export class AddDataComponent implements OnInit {
  calculateBg = calculateBg;
  types: Type[] = [];
  categories: Category[]= [];
  moves: Move[] = [];
  effects: Effect[] = [];
  stages: Stage[] = [];

  selectedMove: Move | null = null;
  selectedPokemonChange: Monster | null = null;
  selectedPokemonAddAttack: Monster | null = null;
  selectedPokemonStage: Monster | null = null;

  postForms = true;
  putForms = true;

  addMoveForm: FormGroup;
  addPokemonForm: FormGroup;
  changeMoveForm: FormGroup;
  changePokemonForm: FormGroup;
  addAttackForm: FormGroup;
  addPokemonStageForm: FormGroup;

  createdPokemon: Monster | null = null;
  monsters: Monster[] = [];

  

  
  constructor(private fb: FormBuilder) {
    this.addMoveForm = this.fb.group({
      moveName: ['', [Validators.required]],
      power: ['', [Validators.required]],
      accuracy: ['', [Validators.required]],
      type: ['', [Validators.required]],
      category: ['', [Validators.required]],
      effect: [''],
      odds: ['']
    });

    this.addPokemonForm = this.fb.group({
      pokemonName: ['', [Validators.required, Validators.minLength(3)]],
      hp: ['', [Validators.required]],
      attack: ['', [Validators.required]],
      defense: ['', [Validators.required]],
      specialAttack: ['', [Validators.required]],
      specialDefense: ['', [Validators.required]],
      speed: ['', [Validators.required]],
      expRate: ['', [Validators.required]],
      catchRate: ['', [Validators.required]],
      type1: ['', [Validators.required]],
      type2: [''],
    });

    this.changeMoveForm = this.fb.group({
      move: ['', [Validators.required]],
      moveName: ['', [Validators.required]],
      power: ['', [Validators.required]],
      accuracy: ['', [Validators.required]],
      type: ['', [Validators.required]],
      category: ['', [Validators.required]],
      effect: [''],
      odds: ['']
    });

    this.changePokemonForm = this.fb.group({
      pokemonName: ['', [Validators.required, Validators.minLength(3)]],
      hp: ['', [Validators.required]],
      attack: ['', [Validators.required]],
      defense: ['', [Validators.required]],
      specialAttack: ['', [Validators.required]],
      specialDefense: ['', [Validators.required]],
      speed: ['', [Validators.required]],
      expRate: ['', [Validators.required]],
      catchRate: ['', [Validators.required]],
      type1: ['', [Validators.required]],
      type2: [''],
    });

     this.addAttackForm = this.fb.group({
      move: ['', [Validators.required]],
      level: ['', [Validators.required, Validators.min(1)]],
    });

    this.addPokemonStageForm = this.fb.group({
      stage: ['', [Validators.required]],
    });
  }


async ngOnInit() {
  forkJoin([
    this.fetchTypes(),
    this.fetchMonsters(),
    this.fetchMoves(),
    this.fetchCategories(),
    this.fetchEffects(),
    this.fetchStages()
  ]).subscribe(
    ([types, monsters, moves, categories, effects, stages]) => {
      this.types = types;
      this.monsters = transformManyPokemonDTO(monsters);
      this.moves = moves;
      this.categories = categories;
      this.effects = effects;
      this.stages = stages;
    },
    error => {
      console.error('Error fetching data', error);
    }
  );
}

  updateChangePokemonForm(monster: Monster) {
    this.changePokemonForm.patchValue({
          pokemonName: monster.name,
          hp: monster.hp,
          attack: monster.attack,
          defense: monster.defense,
          specialAttack: monster.specialAttack,
          specialDefense: monster.specialDefense,
          speed: monster.speed,
          expRate: monster.expRate,
          catchRate: monster.catchRate,
          type1: monster.types[0].name,
          type2: monster.types[1]?.name
        });
    this.selectedPokemonChange = monster;
  }

  updateAddAttackForm(monster: Monster) {
    this.selectedPokemonAddAttack = monster
  }

  updateChangeMoveForm() {
    const move = this.moves.find((move: Move) => move.id == this.changeMoveForm.get('move')?.value);
    if (!move) return;
    this.changeMoveForm.patchValue({
      moveName: move.name,
      power: move.power,
      accuracy: move.accuracy,
      type: move.type.name,
      category: move.category?.name,
      effect: move.moveEffects[0]?.effect.name,
      odds: move.moveEffects[0]?.odds
    });
    this.selectedMove = move;
  }

  toggleForm(form: 'post' | 'put') {
    if (form === 'post') {
      this.postForms = !this.postForms;
    } else {
      this.putForms = !this.putForms;
    }
  }

  async fetchMoves() {
    const moves = await api.get('/move').then((response: any) => {
      return response.data;
    });
    return moves;
  }

  async fetchCategories() {
    const response = await api.get('/category');
    return response.data;
  }

  async fetchTypes() {
    const response = await api.get('/type');
    return response.data;
  }

  async fetchEffects() {
    const response = await api.get('/effect');
    return response.data;
  }

  async fetchMonsters() {
    const monsters = await api.get('pokemon').then((response: any) => {
      return response.data;
    });
    return monsters;
  }

  async fetchStages() {
    const stages = await api.get('stage').then((response: any) => {
      return response.data;
    });
    return stages;
  }

  async addPokemon() {
    const pokemon = {
      name: this.addPokemonForm.get('pokemonName')?.value,
      hp: this.addPokemonForm.get('hp')?.value,
      attack: this.addPokemonForm.get('attack')?.value,
      defense: this.addPokemonForm.get('defense')?.value,
      specialAttack: this.addPokemonForm.get('specialAttack')?.value,
      specialDefense: this.addPokemonForm.get('specialDefense')?.value,
      speed: this.addPokemonForm.get('speed')?.value,
      expRate: this.addPokemonForm.get('expRate')?.value,
      catchRate: this.addPokemonForm.get('catchRate')?.value,
      typeName: [this.addPokemonForm.get('type1')?.value]
    };
    this.addPokemonForm.get('type2')?.value ? pokemon.typeName.push(this.addPokemonForm.get('type2')?.value) : null;

    const response = await api.post('/pokemon', pokemon);
    if (response.status === 200) {
      this.addPokemonForm.reset();
      this.createdPokemon = response.data;
    }
  }

  async addMove() {
    const move = {
      name: this.addMoveForm.get('moveName')?.value,
      power: this.addMoveForm.get('power')?.value,
      accuracy: this.addMoveForm.get('accuracy')?.value,
      type: this.addMoveForm.get('type')?.value,
      category: this.addMoveForm.get('category')?.value,
      effect: this.addMoveForm.get('effect')?.value || null,
      odds: this.addMoveForm.get('odds')?.value || null
    };

    const response = await api.post('/move', move);
    if (response.status === 200) {
      this.addMoveForm.reset();
    }
  }

  async changePokemon() {
    const pokemon = {
      name: this.changePokemonForm.get('pokemonName')?.value,
      hp: this.changePokemonForm.get('hp')?.value,
      attack: this.changePokemonForm.get('attack')?.value,
      defense: this.changePokemonForm.get('defense')?.value,
      specialAttack: this.changePokemonForm.get('specialAttack')?.value,
      specialDefense: this.changePokemonForm.get('specialDefense')?.value,
      speed: this.changePokemonForm.get('speed')?.value,
      expRate: this.changePokemonForm.get('expRate')?.value,
      catchRate: this.changePokemonForm.get('catchRate')?.value,
      typeName: [this.changePokemonForm.get('type1')?.value]
    };
    this.changePokemonForm.get('type2')?.value ? pokemon.typeName.push(this.changePokemonForm.get('type2')?.value) : null;

    const response = await api.put(`/pokemon/${this.selectedPokemonChange?.id}`, pokemon);
    if (response.status === 200) {
      this.changePokemonForm.reset();
      this.selectedPokemonChange = response.data;
    }
  }

  async changeMove() {
    const move = {
      name: this.changeMoveForm.get('moveName')?.value,
      power: this.changeMoveForm.get('power')?.value,
      accuracy: this.changeMoveForm.get('accuracy')?.value,
      type: this.changeMoveForm.get('type')?.value,
      category: this.changeMoveForm.get('category')?.value,
      effect: this.changeMoveForm.get('effect')?.value,
      odds: this.changeMoveForm.get('odds')?.value
    }

    const response = await api.patch(`/move/${this.selectedMove?.id}`, move);
    if (response.status === 200) {
      this.changeMoveForm.reset();
      this.selectedMove = response.data;
    }
  }

  async addAttack() {
    const attack = {
      pokemonName: this.selectedPokemonAddAttack?.name,
      moveName: this.addAttackForm.get('move')?.value,
      level: this.addAttackForm.get('level')?.value,
    };
    const response = await api.post('/pokemon_move', attack);
    if (response.status === 200) {
      this.addAttackForm.reset();
    }
  }

  async addPokemonStage() {
    const stage = {
      pokemonId: this.selectedPokemonStage?.id,
      stageId: parseInt(this.addPokemonStageForm.get('stage')?.value),
    };

    const response = await api.post(`/stage_pokemon`, stage);
    if (response.status === 200) {
      this.addPokemonStageForm.reset();
    }
  }
}
