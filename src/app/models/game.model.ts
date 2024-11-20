import { Monster } from "./monster.model";
export class Game {
    id: number;    
    playerMonster: Monster;
    enemyMonster: Monster;
    turn: number = 0;
    currentPokemon: Monster;

    constructor(id: number, playerMonster: Monster, enemyMonster: Monster) {
        this.id = id;
        this.playerMonster = playerMonster;
        this.enemyMonster = enemyMonster
        this.currentPokemon = playerMonster > enemyMonster ? playerMonster : enemyMonster;
    }

    playerAttack() {
        this.enemyMonster.hp -= this.currentPokemon.attack;
        if(this.enemyMonster.hp <= 0) {
            return;
        }
        this.enemyAttack();
    }

    enemyAttack() {
        this.playerMonster.hp -= this.currentPokemon.attack;
        if(this.playerMonster.hp <= 0) {
            return;
        }
    }

}