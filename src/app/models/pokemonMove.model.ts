import { Move } from './move.model';

export class PokemonMove { 
    id: number;
    move: Move;
    level: number;

    constructor(id:number, move: Move, level: number) {
        this.id = id;
        this.move = move;
        this.level = level;
    }
}