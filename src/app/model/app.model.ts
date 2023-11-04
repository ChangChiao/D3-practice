export interface VoteState {
  vote: Vote[];
}

export interface Vote {
  userId: number;
  id: number;
  title: string;
  body: string;
}
