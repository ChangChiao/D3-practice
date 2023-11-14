import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject, signal } from '@angular/core';
import {
  BehaviorSubject,
  EMPTY,
  Observable,
  catchError,
  combineLatest,
  finalize,
  forkJoin,
  map,
  tap,
} from 'rxjs';
import { CountryData, TownData, VillageData, Vote } from '../model';
import { AppComponentStore } from '../store/app.state';
import { combineData } from '../utils/combineData';

@Injectable({ providedIn: 'root' })
export class AppService {
  #api = inject(HttpClient);
  #store = inject(AppComponentStore);
  // #API_PATH = 'https://jsonplaceholder.typicode.com/todos';
  #API_PATH = '/assets/data';

  countryVoteData$ = new BehaviorSubject(null);
  townVoteData$ = new BehaviorSubject(null);
  villageVoteData$ = new BehaviorSubject(null);

  getCountry() {
    return this.countryVoteData$;
  }

  getTown() {
    return this.townVoteData$;
  }

  getVillage() {
    return this.villageVoteData$;
  }

  // getVoteData() {
  //   return combineLatest([
  //     this.countryVoteData$,
  //     this.townVoteData$,
  //     this.villageVoteData$,
  //   ]);
  // }

  mergeData() {
    forkJoin([this.fetchVILLAGE$, this.fetchVillageData$]).subscribe(
      ([a, b]) => {
        console.log('a, b', a, b);
        const res = combineData(a, b, 'village');
        console.log('res', JSON.stringify(res));
      }
    );
  }

  initService() {
    // this.mergeData();
    return forkJoin([
      this.fetchCountry$,
      this.fetchTownData$,
      this.fetchVillageData$,
    ]);
  }

  fetchCOUNTY$ = this.#api
    .get<CountryData>(`${this.#API_PATH}/COUNTY_MOI_1090820.json`)
    .pipe(
      map((res) => res),
      catchError((err: unknown) => EMPTY)
    );

  fetchTOWN$ = this.#api
    .get<CountryData>(`${this.#API_PATH}/TOWN_MOI_1120825.json`)
    .pipe(
      map((res) => res),
      catchError((err: unknown) => EMPTY)
    );

  fetchVILLAGE$ = this.#api
    .get<CountryData>(`${this.#API_PATH}/VILLAGE_NLSC_1120928.json`)
    .pipe(
      map((res) => res),
      catchError((err: unknown) => EMPTY)
    );

  fetchCountry$ = this.#api
    .get<CountryData>(`${this.#API_PATH}/country-vote-data.json`)
    .pipe(
      map((res) => res),
      catchError((err: unknown) => EMPTY)
    );

  fetchTownData$ = this.#api
    .get<TownData>(`${this.#API_PATH}/town-vote-data.json`)
    .pipe(
      map((res) => res),
      catchError((err: unknown) => EMPTY)
    );

  fetchVillageData$ = this.#api
    .get<VillageData>(`${this.#API_PATH}/village-vote-data.json`)
    .pipe(
      map((res) => res),
      catchError((err: unknown) => EMPTY)
    );
}
