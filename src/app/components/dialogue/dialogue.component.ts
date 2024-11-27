import { Component, Input, output, Renderer2 } from '@angular/core';

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

  private keyDownListener: () => void;

  constructor(private render: Renderer2) {
    this.keyDownListener = this.render.listen('document', 'keydown', (event: KeyboardEvent) => {
      if (event.key === "Enter") this.pushNext();
    })
  }
  
  ngOnDestroy(): void {
      if (this.keyDownListener){
        this.keyDownListener();
      }
  }

  pushNext() {
    this.dialogues.shift();
    this.next.emit(this.dialogues);
  }
}
