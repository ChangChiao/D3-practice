import { Injectable, inject } from '@angular/core';
import { ComponentStore } from '@ngrx/component-store';
import { Vote, VoteState } from '../model/app.model';
import { EMPTY, catchError, forkJoin, map } from 'rxjs';
import { AppService } from '../service';
import { CountryData, TownData, VillageData } from '../model';

const initState = {
  countryVoteData: null,
  townVoteData: null,
  villageVoteData: null,
  isLoading: false,
};

@Injectable({ providedIn: 'root' })
export class AppComponentStore extends ComponentStore<VoteState> {
  #service = inject(AppService);

  fetchaaa$ = this.#service.fetchCountry$.pipe(map((data) => data));

  voteData$ = forkJoin([
    this.#service.fetchCountry$,
    this.#service.fetchTownData$,
    this.#service.fetchVillageData$,
  ]).pipe(
    map((data) => data),
    catchError(() => EMPTY)
  );

  // readonly #loading$ = this.select(({ isLoading }
  // this.#service.fetchData$.pipe(
  //   map((data) => data),
  //   catchError(() => EMPTY)
  // );

  readonly #countryVoteData$ = this.select(
    ({ countryVoteData }) => countryVoteData
  );
  readonly #townVoteData$ = this.select(({ townVoteData }) => townVoteData);
  readonly #villageVoteData$ = this.select(
    ({ villageVoteData }) => villageVoteData
  );
  readonly vm$ = this.select(
    this.#countryVoteData$,
    this.#townVoteData$,
    this.#villageVoteData$,
    (country, town, village) => ({ country, town, village }),
    {
      debounce: true,
    }
  );
  readonly loading$ = this.select(({ isLoading }) => isLoading);

  readonly setCountry = this.updater((state, payload: CountryData) => ({
    ...state,
    countryVoteData: payload,
  }));

  readonly setTown = this.updater((state, payload: TownData) => ({
    ...state,
    townVoteData: payload,
  }));

  readonly setVillage = this.updater((state, payload: VillageData) => ({
    ...state,
    villageVoteData: payload,
  }));

  readonly setLoading = this.updater((state, payload: boolean) => ({
    ...state,
    isLoading: payload,
  }));

  constructor() {
    super(initState);
  }
}
