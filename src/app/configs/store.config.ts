import { provideEffects } from '@ngrx/effects';
import { provideState, provideStore } from '@ngrx/store';
import { VOTE_DATA_STORE_KEY, voteDataReducer } from '../store/app.reducer';
import { VoteDataEffects } from '../store/app.effects';

export function providerStoreConfig() {
  return [provideStore(voteDataReducer), provideEffects([VoteDataEffects])];
}
