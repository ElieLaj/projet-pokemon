import { Monster } from "./monster/monster.model";

export class Item {

    id: number;
    name: string;
    description: string;
    price: number;
    bagId: number;

    constructor(id: number, name: string, description: string, price: number, bagId: number) {
        this.id = id;
        this.name = name;
        this.description = description;
        this.price = price;
        this.bagId = bagId;
    }

    use(monster: Monster, dialogues: String[]): void {
        
    }
}