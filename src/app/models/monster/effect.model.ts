export class Effect {
    id: number
    name: string;
    turns: number;

    constructor(id: number, name: string, turns: number) {
        this.id = id;
        this.name = name;
        this.turns = turns;
    }
}