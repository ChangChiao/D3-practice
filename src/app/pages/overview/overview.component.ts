import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  computed,
  effect,
  inject,
  signal,
  untracked,
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
      <a [routerLink]="['/ani']"> ani </a>
      <p class="title">overview works!</p>
      <p>count: {{ count() }}</p>
      <p>person: {{ person() }}</p>
      <p>doubleCount: {{ doubleCount() }}</p>
      <button (click)="setCount()">set count</button>
      <button (click)="setPerson()">set person</button>
    </div>
  `,
  styleUrls: ['./overview.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OverviewComponent {
  count = signal(0);
  person = signal(0);
  doubleCount = computed(() => this.count() * 2);
  // setCount() {
  //   this.count.set(3);
  // }
  constructor() {
    effect(() => {
      const count = this.count();
      untracked(() => {
        console.log('effect', count, this.person());
        // this.someMethodThatReadsSignals(count);
      });
    });
  }

  someMethodThatReadsSignals(count: number) {
    console.log('someMethodThatReadsSignals' + count);
  }

  setCount() {
    this.count.update((val) => val + 1);
  }
  setPerson() {
    this.person.update((val) => val + 1);
  }
}
