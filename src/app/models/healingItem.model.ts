import { Item } from './item.model';
import { Monster } from './monster/monster.model';
import { Trainer } from './trainer.model';

export class HealingItem extends Item {
    healAmount: number;

    constructor(id: number, name: string, description: string, price: number, healAmount: number, bagId: number) {
        super(id, name, description, price, bagId);
        this.healAmount = healAmount;
    }

    override use(monster: Monster, dialogues: String[]): void {
        monster.heal(this.healAmount);
        dialogues.push(`${monster.name} has been healed by ${this.healAmount} points.`);
    }
}