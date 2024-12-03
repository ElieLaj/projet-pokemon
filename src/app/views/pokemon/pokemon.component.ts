import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Monster } from '../../models/monster/monster.model';
import { api } from '../../../plugins/api';
import { switchMap } from 'rxjs/operators';
import { PokemonMove } from '../../models/monster/pokemonMove.model';
import { calculateBg } from '../../utils/game.utils';

@Component({
  selector: 'app-pokemon',
  standalone: true,
  imports: [],
  templateUrl: './pokemon.component.html',
  styleUrl: './pokemon.component.scss'
})
export class PokemonComponent {

  pokemon!: Monster;
  pokemonImage!: string;
  pokemonMoves: PokemonMove[] = [];
  constructor(private route: ActivatedRoute) {}

  async ngOnInit() {
    this.route.params.pipe(
      switchMap((params) => this.fetchMonster(params['id']))
    ).subscribe((monster) => {
      this.pokemon = monster;
      this.pokemonMoves = monster.pokemonMoves.sort((a, b) => a.level - b.level);
      this.pokemonImage = 'https://img.pokemondb.net/sprites/black-white/anim/normal/'+ monster.name.toLowerCase()+'.gif';
    });
  }

  async fetchMonster(id: number): Promise<Monster> {
    const monster = await api.get(`pokemon/${id}`).then((response: any) => {
      return response.data;
    });
    return monster;
  }

  calculateBg = calculateBg;
}
