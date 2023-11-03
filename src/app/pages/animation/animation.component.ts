import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  animate,
  state,
  style,
  transition,
  trigger,
} from '@angular/animations';

@Component({
  selector: 'app-animation',
  standalone: true,
  imports: [CommonModule],
  template: `<nav>
      <button type="button" (click)="toggle()">Toggle Open/Close</button>
    </nav>

    <div [@openClose]="isOpen ? 'open' : 'closed'" class="open-close-container">
      <p>The box is now {{ isOpen ? 'Open' : 'Closed' }}!</p>
    </div>`,
  styleUrls: ['./animation.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [
    trigger('openClose', [
      // ...
      state(
        'open',
        style({
          height: '200px',
          opacity: 1,
          backgroundColor: 'yellow',
        })
      ),
      state(
        'closed',
        style({
          height: '100px',
          opacity: 0.8,
          backgroundColor: 'blue',
        })
      ),
      transition('open => closed', [animate('1s')]),
      transition('closed => open', [animate('0.5s')]),
    ]),
  ],
})
export class AnimationComponent {
  isOpen = true;

  toggle() {
    this.isOpen = !this.isOpen;
  }
}
