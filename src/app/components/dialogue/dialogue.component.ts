import { Component, Input, output, Output } from '@angular/core';

@Component({
  selector: 'app-dialogue',
  standalone: true,
  imports: [],
  templateUrl: './dialogue.component.html',
  styleUrl: './dialogue.component.scss'
})
export class DialogueComponent {
  @Input() dialogues: string[] = [];
  next = output<string[]>();


  pushNext() {
    this.dialogues.shift();
    this.next.emit(this.dialogues);
  }
}
