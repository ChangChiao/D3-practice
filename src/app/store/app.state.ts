import { Injectable, inject } from '@angular/core';
import { ComponentStore, tapResponse } from '@ngrx/component-store';
import { Vote, VoteState } from '../model/app.model';
import { EMPTY, catchError, map } from 'rxjs';
import { AppService } from '../service';

const initState = {
  vote: [],
};

export const TODO_KEY = 'todo';

@Injectable({ providedIn: 'root' })
export class AppComponentStore extends ComponentStore<VoteState> {
  #service = inject(AppService);

  voteData$ = this.#service.fetchData$.pipe(
    map((data) => data),
    catchError(() => EMPTY)
  );

  readonly #voteData$ = this.select(({ vote }) => vote);
  readonly vm$ = this.select(
    this.#voteData$,
    // this.#loading$,
    (data) => ({ vote: data }),
    {
      debounce: true,
    }
  );

  readonly setVote = this.updater((state, payload: Vote[]) => ({
    vote: payload,
  }));

  constructor() {
    super(initState);
  }
}
