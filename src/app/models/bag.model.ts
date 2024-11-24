import { HealingItem } from "./healingItem.model";
import { Item } from "./item.model";
import { Monster } from "./monster/monster.model";
import { Pokeball } from "./pokeball.model";

export class Bag {

    healingItems: HealingItem[];
    pokeballs: Pokeball[];

    constructor(hItems: HealingItem[], pokeballs: Pokeball[]) {
        this.healingItems = []
        this.addMultipleHealingItems([...hItems]);
        this.pokeballs = pokeballs;
    }

    addHealingItem(hItems: HealingItem, quantity: number) {
        for (let i = 0; i < quantity; i++) {
            const healingItem = new HealingItem(hItems.id, hItems.name, hItems.description, hItems.price, hItems.healAmount, this.healingItems.length);
            this.healingItems.push(healingItem);
        }
    }

    addMultipleHealingItems(hItems: HealingItem[]) {
        hItems.forEach(hItem => {
            this.addHealingItem(hItem, 1);
        });
    }

    useItem(item: Item, monster: Monster, dialogues: String[]) {
        if (item instanceof HealingItem) {
            item.use(monster, dialogues);
            this.healingItems = this.healingItems.filter(hItem => hItem.bagId !== item.bagId);
        }
    }

}