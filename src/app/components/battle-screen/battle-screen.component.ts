import { Component, Input, OnInit, Output, EventEmitter, Renderer2, OnDestroy } from '@angular/core';
import { Monster } from '../../models/monster/monster.model';
import { MonsterComponent } from '../monster/monster.component';
import { ActionType, calculateBg } from '../../utils/game.utils';
import { DialogueComponent } from "../dialogue/dialogue.component";
import { Game } from '../../models/game.model';
import { DisplayStageComponent } from "../display-stage/display-stage.component";
import { ShopComponent } from '../shop/shop.component';
import { LearnMovesComponent } from "../learn-moves/learn-moves.component";

@Component({
  selector: 'app-battle-screen',
  standalone: true,
  imports: [MonsterComponent, DialogueComponent, DisplayStageComponent, ShopComponent, LearnMovesComponent],
  templateUrl: './battle-screen.component.html',
  styleUrl: './battle-screen.component.scss'
})
export class BattleScreenComponent implements OnDestroy {
  calculateBg = calculateBg;

  @Input() game!: Game;


  @Output() changeEnemyMonster = new EventEmitter<any>();
  @Output() playerLost = new EventEmitter<number>();

  private keyDownListener: () => void;

  confirmRun: boolean = false;

  constructor(private render: Renderer2) {
    this.keyDownListener = this.render.listen('document', 'keydown', (event: KeyboardEvent) => {
      console.log(event.key);
      if (!this.game.playerAction && this.game.dialogues.length === 0 && this.game.playerMonster.learnMovewaitList.length === 0 && !this.game.checkPokemonEvolution()) {
            switch(event.key){
              case("&"):
                this.game.setAction(ActionType.SelectAttack);
                break;
              case("é"):
                this.game.setAction(ActionType.SelectItemType);
                break;
              case("\""):
                this.game.setAction(ActionType.SelectSwap);
                break;
              case("'"):
                this.game.setAction(ActionType.Run);
                break;
        }
      }
      else if(this.game.playerAction === ActionType.SelectAttack && this.game.turnEnded && this.game.dialogues.length === 0 && this.game.playerMonster.learnMovewaitList.length === 0 && !this.game.playerMonster.canEvolve){
        switch(event.key){
          case("&"):
            this.game.playerSelectedAttack = this.game.playerMonster.pokemonMoves[0]?.move;
            break;
          case("é"):
            this.game.playerSelectedAttack = this.game.playerMonster.pokemonMoves[1]?.move;
            break;
          case("\""):
            this.game.playerSelectedAttack = this.game.playerMonster.pokemonMoves[2]?.move;
            break;
          case("'"):
            this.game.playerSelectedAttack = this.game.playerMonster.pokemonMoves[3]?.move;
            break;
        }
        this.game.playerSelectedAttack ? this.game.setAction(ActionType.Attack) : null;
      }
      else if(this.game.playerAction === ActionType.SelectSwap && this.game.turnEnded && this.game.dialogues.length === 0 && this.game.playerMonster.learnMovewaitList.length === 0 && !this.game.playerMonster.canEvolve){
        switch(event.key){
          case("&"):
            this.game.playerSelectedMonster = this.game.player.monsters[0];
            break;
          case("é"):
            this.game.playerSelectedMonster = this.game.player.monsters[1];
            break;
          case("\""):
            this.game.playerSelectedMonster = this.game.player.monsters[2];
            break;
          case("'"):
            this.game.playerSelectedMonster = this.game.player.monsters[3];
            break;
          case("("):
            this.game.playerSelectedMonster = this.game.player.monsters[4];
            break;
          case("-"):
            this.game.playerSelectedMonster = this.game.player.monsters[5];
            break;
        }
        if (this.game.playerSelectedMonster && this.game.playerSelectedMonster.specialId != this.game.playerMonster.specialId){
          this.game.setAction(ActionType.Swap);
        }
      }
      if(this.game.playerAction && this.game.turnEnded && event.key === "Escape"){
        this.game.playerAction = null;
      }
    })
  }

  ngOnDestroy(): void {
      if (this.keyDownListener){
        this.keyDownListener();
      }
  }

  ngDoCheck() {
    this.game.checkTurn();
    if (this.game.playerLost === true) {
      this.playerLost.emit(this.game.playerScore);
    }
    else if (this.game.enemyMonster.hp <= 0 && this.game.dialogues.length === 0 && !this.game.playerMonster.canEvolve) {
      this.changeEnemyMonster.emit();
      this.game.enemyLost = false;
    }
  }



}
