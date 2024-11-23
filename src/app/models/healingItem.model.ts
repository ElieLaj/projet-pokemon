import { Item } from './item.model';

export class HealingItem extends Item {
    healAmount: number;

    constructor(id: number, name: string, description: string, price: number, healAmount: number) {
        super(id, name, description, price);
        this.healAmount = healAmount;
    }

}