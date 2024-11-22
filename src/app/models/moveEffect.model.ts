import e from "express";
import { Effect } from "./effect.model";

export class MoveEffect {
    id: number
    odds: number;
    effect: Effect;

    constructor(id: number, odds: number, effect: Effect) {
        this.id = id;
        this.odds = odds;
        this.effect = effect;
    }
}