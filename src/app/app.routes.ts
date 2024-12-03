import { Routes } from '@angular/router';
import { GameComponent } from './views/game/game.component';
import { PokemonComponent } from './views/pokemon/pokemon.component';
import { PokedexComponent } from './views/pokedex/pokedex.component';

export const routes: Routes = [
    {
        path: '',
        component: GameComponent
    },
    {
        path: 'pokedex',
        component: PokedexComponent
    },
    {
        path: 'monster/:id',
        component: PokemonComponent
    },
    {
        path: '**',
        redirectTo: '/'
    }
];
