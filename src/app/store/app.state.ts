import { Injectable } from '@angular/core';
import { ComponentStore } from '@ngrx/component-store';
import { Vote, VoteState } from '../model/app.model';

const initState = {
  countrySelected: null,
  townVotSelected: null,
  villageSelected: null,
  isLoading: false,
};

@Injectable({ providedIn: 'root' })
export class AppComponentStore extends ComponentStore<VoteState> {
  readonly #countrySelected$ = this.select(
    ({ countrySelected }) => countrySelected
  );
  readonly #townVotSelected$ = this.select(
    ({ townVotSelected }) => townVotSelected
  );
  readonly #villageSelected$ = this.select(
    ({ villageSelected }) => villageSelected
  );
  readonly vm$ = this.select(
    this.#countrySelected$,
    this.#townVotSelected$,
    this.#villageSelected$,
    (countrySelected, townVotSelected, villageSelected) => ({
      countrySelected,
      townVotSelected,
      villageSelected,
    }),
    {
      debounce: true,
    }
  );
  readonly loading$ = this.select(({ isLoading }) => isLoading);

  readonly setCountrySelected = this.updater(
    (state, payload: string | null) => ({
      ...state,
      countrySelected: payload,
    })
  );

  readonly setTownSelected = this.updater((state, payload: string | null) => ({
    ...state,
    townVotSelected: payload,
  }));

  readonly setVillageSelected = this.updater(
    (state, payload: string | null) => ({
      ...state,
      villageSelected: payload,
    })
  );

  readonly setLoading = this.updater((state, payload: boolean) => ({
    ...state,
    isLoading: payload,
  }));

  constructor() {
    super(initState);
  }
}
