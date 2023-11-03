import { Injectable, inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';
import {
  VoteDataActionsUnion,
  loadVoteData,
  loadVoteDataFail,
  loadVoteDataSuccess,
} from './app.actions';
import { VoteService } from '../service/vote-data.service';

@Injectable()
export class VoteDataEffects {
  #actions$ = inject(Actions<VoteDataActionsUnion>);
  #voteService = inject(VoteService);

  loadVoteData$ = createEffect(() =>
    this.#actions$.pipe(
      ofType(loadVoteData.type),
      switchMap(() =>
        this.#voteService.fetchData$.pipe(
          map((payload) => {
            console.log('payload', payload)
            return loadVoteDataSuccess({ payload })
          }),
          catchError((error) => of(loadVoteDataFail({ payload: error })))
        )
      )
    )
  );  
}
