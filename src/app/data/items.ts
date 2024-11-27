import { HealingItem } from "../models/healingItem.model";
import { Pokeball } from "../models/pokeball.model";

export const items = {
    potion: new HealingItem(1, 'Potion', 'Heals 20 HP', 200, 20, 0),
    superPotion: new HealingItem(2, 'Super Potion', 'Heals 50 HP', 500, 50, 0),
    hyperPotion: new HealingItem(3, 'Hyper Potion', 'Heals 200 HP', 1200, 120, 0),
    maxPotion: new HealingItem(4, 'Max Potion', 'Heals to full HP', 2500, 999, 0),
    sodaPop: new HealingItem(5, 'Soda Pop', 'Heals 60 HP', 300, 60, 0),
    lemonade: new HealingItem(6, 'Lemonade', 'Heals 80 HP', 350, 80, 0),
    freshWater: new HealingItem(7, 'Fresh Water', 'Heals 30 HP', 200, 30, 0),
    moomooMilk: new HealingItem(8, 'Moomoo Milk', 'Heals 100 HP', 500, 100, 0),
    pokeball: new Pokeball(9, 'Pokeball', 'Catches a monster', 200, 1, 0),
    greatBall: new Pokeball(10, 'Great Ball', 'Catches a monster', 600, 1.5, 0),
    ultraBall: new Pokeball(11, 'Ultra Ball', 'Catches a monster', 1200, 2, 0),
    masterBall: new Pokeball(12, 'Master Ball', 'Catches a monster', 9999, 9999, 0),
    premierBall: new Pokeball(13, 'Premier Ball', 'Catches a monster', 200, 1, 0),
}