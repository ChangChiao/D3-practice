import { HttpErrorResponse } from '@angular/common/http';
import { Update } from '@ngrx/entity';
import { createAction, props, union } from '@ngrx/store';
import { Vote } from '../model';

export const loadVoteData = createAction('[VoteData Component] Load VoteDatas');
export const loadVoteDataSuccess = createAction(
  '[VoteData API] Load VoteDatas success',
  props<{ payload: Vote[] }>()
);
export const loadVoteDataFail = createAction(
  '[VoteData API] Load VoteDatas failed',
  props<{ payload: HttpErrorResponse }>()
);
const all = union({
  loadVoteData,
  loadVoteDataSuccess,
  loadVoteDataFail,
});
export type VoteDataActionsUnion = typeof all;
