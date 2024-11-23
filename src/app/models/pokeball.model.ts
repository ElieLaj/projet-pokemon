import { Item } from "./item.model";

export class Pokeball extends Item {

    catchRate: number;

    constructor(id: number, name: string, description: string, price: number, catchRate: number) {
        super(id, name, description, price);
        this.catchRate = catchRate;
    }

}