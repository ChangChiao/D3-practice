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
import { LetDirective } from '@ngrx/component';
import { AppComponentStore } from '../../store/app.state';
import { MapComponent } from '../../components/map/map.component';
import { DropdownComponent } from '../../components/dropdown/dropdown.component';
import { AppService } from '../../service';

@Component({
  selector: 'app-overview',
  standalone: true,
  imports: [
    CommonModule,
    MapComponent,
    MatIconModule,
    RouterModule,
    LetDirective,
    DropdownComponent,
  ],
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
      <app-map></app-map>
      <app-dropdown></app-dropdown>
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
  // #service = inject(AppService);
  // #store = inject(AppComponentStore);

  // selected$ = this.#store.vm$;
  // voteData$ = this.#service.getVoteData();
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
