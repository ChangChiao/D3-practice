import { CountryData } from './country.model';
import { TownData } from './town.model';
import { VillageData } from './village.model';

export interface AppState {
  mapData: mapState;
  selectedOption: SelectedOptionState;
  isLoading: boolean;
  // voteData:
}

export interface mapState {
  country: CountryData | null;
  town: TownData | null;
  village: VillageData | null;
}

export interface SelectedOptionState {
  country: string | null;
  town: string | null;
  village: string | null;
}

export interface Vote {
  userId: number;
  id: number;
  title: string;
  body: string;
}
