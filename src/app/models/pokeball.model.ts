import { Item } from "./item.model";
import { Monster } from "./monster/monster.model";
import { Trainer } from "./trainer.model";

export class Pokeball extends Item {

    catchRate: number;

    constructor(id: number, name: string, description: string, price: number, catchRate: number, bagId: number) {
        super(id, name, description, price, bagId);
        this.catchRate = catchRate;
    }

    override use(trainer: Trainer, target: Monster, dialogues: String[]) {
        const monsterCopy = new Monster(
                target.id,
                target.name,
                target.baseHp,
                target.baseAttack,
                target.baseDefense,
                target.baseSpecialAttack,
                target.baseSpecialDefense,
                target.baseSpeed,
                target.expRate,
                target.pokemonMoves,
                target.types,
                target.level
        );       

        monsterCopy.hp = target.hp;
        monsterCopy.effect = target.effect;
        monsterCopy.effectTurn = target.effectTurn;

        const bonus = target.effect ? 2 : 1;
        const a = Math.floor(((1 - 2/3 * (target.hp/target.maxHp)) * this.catchRate * target.catchRate * bonus));
        if (a >= 255) {
            trainer.addMonster(monsterCopy);
            dialogues.push(`${target.name} has been caught!`);
        } else {
            const b = Math.floor(65536 / Math.sqrt(Math.sqrt(16711680/a)));
            for (let i = 0; i < 4; i++) {
                const c = Math.floor(Math.random() * 65536);
                    if (c < b) {
                        trainer.addMonster(monsterCopy);
                        dialogues.push(`${target.name} has been caught!`);
                        return;
                    }
            }
            
            dialogues.push(`${target.name} has escaped!`);
        }
    }
}