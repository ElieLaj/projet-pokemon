import { Routes } from '@angular/router';
import { GameComponent } from './components/game/game.component';
import { AddDataComponent } from './components/add-data/add-data.component';

export const routes: Routes = [
    {
        path: '',
        component: GameComponent
    },
    {
        path: 'admin',
        component: AddDataComponent
    },
    {
        path: '**',
        redirectTo: '/'
    }
];
