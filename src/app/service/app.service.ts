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

  initService() {
    return forkJoin([
      this.fetchCountry$,
      this.fetchTownData$,
      this.fetchVillageData$,
    ]);
  }

  fetchCountry$ = this.#api
    .get<CountryData>(`${this.#API_PATH}/country-data.json`)
    .pipe(
      map((res) => res),
      catchError((err: unknown) => EMPTY)
    );

  fetchTownData$ = this.#api
    .get<TownData>(`${this.#API_PATH}/town-data.json`)
    .pipe(
      map((res) => res),
      catchError((err: unknown) => EMPTY)
    );

  fetchVillageData$ = this.#api
    .get<VillageData>(`${this.#API_PATH}/village-data.json`)
    .pipe(
      map((res) => res),
      catchError((err: unknown) => EMPTY)
    );
}
