import { Attack } from "./attack.model";

export class Monster {
    id: number;
    name: string;
    type: string;
    hp: number;
    attack: number;
    speed: number;
    maxHp: number;
    attacks: Attack[];

    constructor(id: number, name: string, type: string, hp: number, attack: number, speed: number, attacks: Attack[]) {
        this.id = id;
        this.name = name;
        this.type = type;
        this.hp = hp;
        this.attack = attack;
        this.speed = speed;
        this.maxHp = hp;
        this.attacks = attacks;
    }
}