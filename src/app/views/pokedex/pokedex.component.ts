import { Component, DoCheck, model, OnChanges, OnInit } from '@angular/core';
import { Game } from '../../models/game/game.model';
import { api } from '../../../plugins/api';
import { PokemonDisplayComponent } from '../../components/pokemon-display/pokemon-display.component';
import { Monster } from '../../models/monster/monster.model';
import {Router} from '@angular/router';
import { transformManyPokemonDTO } from '../../utils/game.utils';
import { FormsModule } from '@angular/forms';
@Component({
  selector: 'app-pokedex',
  standalone: true,
  imports: [PokemonDisplayComponent, FormsModule],
  templateUrl: './pokedex.component.html',
  styleUrl: './pokedex.component.scss'
})
export class PokedexComponent implements DoCheck, OnInit{
  currentYear!: number;

  monsters: Monster[] = [];
  filteredMonsters: Monster[] = [];

  search = '';

  hoverMonster: number | null = null;

  game!: Game;

  constructor(private _router: Router) {
    this.currentYear = new Date().getFullYear();
  }

  async ngOnInit() { 
    this.monsters = await this.fetchMonsters();
    this.filteredMonsters = this.monsters;
  }

  ngDoCheck() {
    if (this.search) {
    this.filteredMonsters = [...this.monsters].filter((monster) => {
      return monster.name.toLowerCase().includes(this.search.toLowerCase());
    });
    console.log(this.filteredMonsters);
    }
  }

  viewMonster(monster: Monster) {
    this._router.navigate([`/monster/${monster.id}`]);
  }

  async fetchMonsters(): Promise<Monster[]> {
    const monsters = await api.get('pokemon').then((response: any) => {
      return response.data;
    });
    return transformManyPokemonDTO(monsters);
  }
}
