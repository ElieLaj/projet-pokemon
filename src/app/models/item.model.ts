import { Monster } from "./monster/monster.model";
import { Trainer } from "./trainer.model";

export class Item {

    id: number;
    name: string;
    description: string;
    price: number;
    bagId: number;

    constructor(id: number, name: string, description: string, price: number, bagId: number) {
        if (new.target === Item) {
            throw new Error("AbstractClass cannot be instantiated directly.");
        }
        this.id = id;
        this.name = name;
        this.description = description;
        this.price = price;
        this.bagId = bagId;
    }

    use(..._args: any[]): void {
        throw new Error("The 'use' method must be implemented by subclasses.");
    }
}