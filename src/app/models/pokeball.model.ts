import { Item } from "./item.model";

export class Pokeball extends Item {

    catchRate: number;

    constructor(id: number, name: string, description: string, price: number, catchRate: number, bagId: number) {
        super(id, name, description, price, bagId);
        this.catchRate = catchRate;
    }

}