import { createEntityAdapter, EntityAdapter, EntityState } from '@ngrx/entity';
import { Vote } from '../model/vote.model';
import {
  loadVoteData,
  loadVoteDataFail,
  loadVoteDataSuccess,
  VoteDataActionsUnion,
} from './app.actions';

export interface VoteDataState extends EntityState<Vote> {
  loading: boolean;
  loaded: boolean;
  data: Vote[];
}

export const VOTE_DATA_STORE_KEY = 'voteData';

const adapter: EntityAdapter<Vote> = createEntityAdapter();

const initialState: VoteDataState = adapter.getInitialState({
  loading: false,
  loaded: false,
  data: [],
});

export function voteDataReducer(
  state = initialState,
  action: VoteDataActionsUnion
): VoteDataState {
  switch (action.type) {
    case loadVoteData.type:
      return {
        ...state,
        loading: true,
        loaded: false,
      };
    case loadVoteDataSuccess.type: {
      const data = action.payload;
      return adapter.setAll(data, {
        ...state,
        loaded: true,
        loading: false,
      });
    }

    default:
      return state;
  }
}

export const { selectAll: selectAllVote, selectEntities: selectVoteEntities } =
  adapter.getSelectors();
