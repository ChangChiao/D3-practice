export interface VoteState {
  vote: Vote[];
  isLoading: boolean;
}

export interface Vote {
  userId: number;
  id: number;
  title: string;
  body: string;
}
