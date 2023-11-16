import { CountryData } from './../../model/country.model';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  signal,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { AppComponentStore } from 'src/app/store/app.state';
import { map, single, tap } from 'rxjs';
import { LetDirective } from '@ngrx/component';
import { VoteState } from 'src/app/model';
import { BarComponent } from '../bar/bar.component';

@Component({
  selector: 'app-bar-container',
  standalone: true,
  imports: [CommonModule, LetDirective, BarComponent],
  template: `
    <div *ngrxLet="vm$ as vm">
      {{ filterResult() | json }}
      <app-bar [filterResult]="filterResult" [data]="filterResult()"></app-bar>
    </div>
  `,
  styleUrls: ['./bar-container.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BarContainerComponent {
  #store = inject(AppComponentStore);
  filterOject = signal({
    type: 'taiwan',
    id: '',
  });
  fullData = signal({});
  vm$ = this.#store.vm$.pipe(
    tap(({ voteData }) => {
      console.log(voteData);
      this.fullData.set(voteData);
    })
  );

  isEmptyObject(obj) {
    return Object.keys(obj).length === 0;
  }

  filterResult = computed(() => {
    if (this.isEmptyObject(this.fullData())) return [];
    const fullData = this.fullData() as VoteState;
    const filterOject = this.filterOject();
    if (this.filterOject().type === 'taiwan') return fullData.country;
    if (this.filterOject().type === 'country') {
      return fullData.town.filter((item) => {
        return item.countyId === filterOject.id;
      });
    }
    if (this.filterOject().type === 'town') {
      return fullData.village.filter((item) => {
        return item.townId === filterOject.id;
      });
    }
    return [];
  });
}
