import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject, signal } from '@angular/core';
import { EMPTY, catchError, finalize, forkJoin, map, tap } from 'rxjs';
import { CountryData, TownData, VillageData, Vote } from '../model';
import { AppComponentStore } from '../store/app.state';

@Injectable({ providedIn: 'root' })
export class AppService {
  #api = inject(HttpClient);
  #store = inject(AppComponentStore);
  // #API_PATH = 'https://jsonplaceholder.typicode.com/todos';
  #API_PATH = '/assets/data';

  countryVoteData = signal({});
  townVoteData = signal({});
  villageVoteData = signal({});
  // fetchData$ = this.#api.get<Vote[]>(this.#API_PATH).pipe(
  //   map((res) => res),
  //   catchError((err: unknown) => EMPTY)
  // );
  initService() {
    this.#store.setLoading(true);
    return forkJoin([
      this.fetchCountry$,
      this.fetchTownData$,
      this.fetchVillageData$,
    ]).pipe(
      map((data) => data),
      tap(([country, town, village]) => {
        this.countryVoteData.set(country);
        this.townVoteData.set(town);
        this.villageVoteData.set(village);
      }),
      finalize(() => this.#store.setLoading(false)),
      catchError(() => EMPTY)
    );
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
