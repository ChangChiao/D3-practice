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
import { Store } from '@ngrx/store';
import { LetDirective } from '@ngrx/component';
import { selectVoteData } from 'src/app/store/app.selectors';

@Component({
  selector: 'app-overview',
  standalone: true,
  imports: [CommonModule, LetDirective, MatIconModule, RouterModule],
  template: `
    <div *ngrxLet="vm$ as vm">
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
      <!-- {{ vm | json }} -->
    </div>
  `,
  styleUrls: ['./overview.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OverviewComponent {
  #store = inject(Store);
  count = signal(0);
  person = signal(0);
  doubleCount = computed(() => this.count() * 2);
  vm$ = this.#store.select(selectVoteData);
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
