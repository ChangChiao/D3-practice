import { Injectable } from '@angular/core';
import { ComponentStore } from '@ngrx/component-store';
import { AppState, SelectedOptionState, VoteState } from '../model/app.model';

const initState = {
  voteData: {
    country: null,
    town: null,
    village: null,
  },
  selectedOption: {
    country: null,
    town: null,
    village: null,
  },
  isLoading: false,
  test: null,
};

@Injectable({ providedIn: 'root' })
export class AppComponentStore extends ComponentStore<AppState> {
  readonly #voteData$ = this.select(({ voteData }) => voteData);
  readonly #selectedOption$ = this.select(
    ({ selectedOption }) => selectedOption
  );

  readonly vm$ = this.select(
    this.#voteData$,
    this.#selectedOption$,
    (voteData, selectedOption) => ({
      voteData,
      selectedOption,
    }),
    {
      debounce: true,
    }
  );
  readonly loading$ = this.select(({ isLoading }) => isLoading);

  readonly setVoteData = this.updater((state, payload: VoteState | null) => ({
    ...state,
    voteData: payload,
  }));

  readonly setSelectedOption = this.updater(
    (state, payload: { key: string; value: string | null }) => ({
      ...state,
      selectedOption: {
        ...state.selectedOption,
        [payload.key]: payload.value,
      },
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
