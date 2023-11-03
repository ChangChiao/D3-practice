import { createFeatureSelector, createSelector } from '@ngrx/store';
import {
  VOTE_DATA_STORE_KEY,
  VoteDataState,
  selectAllVote,
} from './app.reducer';

const selectVoteDataState =
  createFeatureSelector<VoteDataState>(VOTE_DATA_STORE_KEY);

export const selectVoteData = createSelector(
  selectVoteDataState,
  selectAllVote
);

export const selectVoteDataLoading = createSelector(
  selectVoteDataState,
  (state) => state.loading
);

export const selectVoteOperationLoaded = createSelector(
  selectVoteDataState,
  (state) => state.loaded
);
