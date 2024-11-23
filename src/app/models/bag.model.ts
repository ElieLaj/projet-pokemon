import { HealingItem } from "./healingItem.model";
import { Pokeball } from "./pokeball.model";

export class Bag {

    healingItems: HealingItem[];
    pokeballs: Pokeball[];

    constructor(hItems: HealingItem[], pokeballs: Pokeball[]) {
        this.healingItems = hItems;
        this.pokeballs = pokeballs;
    }

}