import { Component, Input } from '@angular/core';
import { Stage } from '../../models/stage.model';
import { PokemonDisplayComponent } from "../pokemon-display/pokemon-display.component";

@Component({
  selector: 'app-display-stage',
  standalone: true,
  imports: [PokemonDisplayComponent],
  templateUrl: './display-stage.component.html',
  styleUrl: './display-stage.component.scss'
})
export class DisplayStageComponent {
  @Input() stage!: Stage;

  showEncounter: boolean = false;
  constructor() { }


}
