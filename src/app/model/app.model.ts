export interface VoteState {
  countrySelected: string | null;
  townVotSelected: string | null;
  villageSelected: string | null;
  isLoading: boolean;
}

export interface Vote {
  userId: number;
  id: number;
  title: string;
  body: string;
}
