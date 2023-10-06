import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  computed,
  effect,
  inject,
  signal,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { ActivatedRoute, RouterModule } from '@angular/router';

@Component({
  selector: 'app-overview',
  standalone: true,
  imports: [CommonModule, MatIconModule, RouterModule],
  template: `
    <div>
      <mat-icon
        aria-hidden="false"
        aria-label="Example home icon"
        fontIcon="home"
        class="green"
      ></mat-icon>
      <mat-icon class="green" svgIcon="fog"></mat-icon>
      <mat-icon svgIcon="moon"></mat-icon>
      <a [routerLink]="['/detail']" [queryParams]="{ id: 1 }">
        link to detail component
      </a>
      <a [routerLink]="['/rwd']"> rwd </a>

      <p class="title">overview works!</p>
      <p>count: {{ count() }}</p>
      <p>doubleCount: {{ doubleCount() }}</p>
      <button (click)="setCount()">set count</button>
    </div>
  `,
  styleUrls: ['./overview.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OverviewComponent {
  count = signal(0);
  doubleCount = computed(() => this.count() * 2);
  // setCount() {
  //   this.count.set(3);
  // }
  constructor() {
    effect(() => {
      console.log('effect' + this.count());
    });
  }

  setCount() {
    this.count.update((val) => val + 1);
  }
}
