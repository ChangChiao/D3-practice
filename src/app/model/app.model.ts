import { CountryData } from './country.model';
import { TownData } from './town.model';
import { VillageData } from './village.model';

export interface VoteState {
  countryVoteData: CountryData | null;
  townVoteData: TownData | null;
  villageVoteData: VillageData | null;
  isLoading: boolean;
}

export interface Vote {
  userId: number;
  id: number;
  title: string;
  body: string;
}
