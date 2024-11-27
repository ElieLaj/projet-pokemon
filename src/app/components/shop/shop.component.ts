import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Pokeball } from '../../models/pokeball.model';
import { HealingItem } from '../../models/healingItem.model';
import { Trainer } from '../../models/trainer.model';

@Component({
  selector: 'app-shop',
  standalone: true,
  imports: [],
  templateUrl: './shop.component.html',
  styleUrl: './shop.component.scss'
})
export class ShopComponent {
  @Input() player!: Trainer;
  @Input() balls!: Pokeball[];
  @Input() hItems!: HealingItem[];

  @Output() exitShop = new EventEmitter();

  buyHealingItem(item: HealingItem) {
    if (this.player.money >= item.price) {
      this.player.money -= item.price;
        this.player.bag.addHealingItem(item, 1);
    }
    else {
      alert('You don\'t have enough money!');
    }
  }

  buyBall(item: Pokeball) {
    if (this.player.money >= item.price) {
            this.player.money -= item.price;
            this.player.bag.addPokeball(item, 1);
    } else {
      alert('You don\'t have enough money!');
    }
  }

  exit() {
    this.exitShop.emit('closed');
  }
}
