import { HealingItem } from "./healingItem.model";
import { Item } from "./item.model";
import { Monster } from "./monster/monster.model";
import { Pokeball } from "./pokeball.model";
import { Trainer } from "./trainer.model";

export class Bag {

    healingItems: HealingItem[];
    pokeballs: Pokeball[];

    constructor(hItems: HealingItem[], pokeballs: Pokeball[]) {
        this.healingItems = []
        this.addMultipleHealingItems([...hItems]);
        this.pokeballs = [];
        this.addMultiplePokeballs([...pokeballs]);
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

    addPokeball(pokeball: Pokeball, quantity: number) {
        for (let i = 0; i < quantity; i++) {
            const pokeballItem = new Pokeball(pokeball.id, pokeball.name, pokeball.description, pokeball.price, pokeball.catchRate, this.pokeballs.length);
            this.pokeballs.push(pokeballItem);
        }
    }

    addMultiplePokeballs(pokeballs: Pokeball[]) {
        pokeballs.forEach(pokeball => {
            this.addPokeball(pokeball, 1);
        });
    }
    useItem(item: Item, monster: Monster, dialogues: String[], trainer: Trainer) {
        if (item instanceof HealingItem) {
            item.use(monster, dialogues);
            this.healingItems = this.healingItems.filter(hItem => hItem.bagId !== item.bagId);
        }
        if (item instanceof Pokeball) {
            item.use(trainer, monster, dialogues);
            this.pokeballs = this.pokeballs.filter(pokeball => pokeball.bagId !== item.bagId);
        }
    }

}