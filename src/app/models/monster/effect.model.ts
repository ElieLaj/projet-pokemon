export class Effect {
    id: number
    name: string;
    turns: number;
    damage: number;

    constructor(id: number, name: string, turns: number, damage: number) {
        this.id = id;
        this.name = name;
        this.turns = turns;
        this.damage = damage;
    }
}