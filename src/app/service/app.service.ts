import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { EMPTY, catchError, map } from 'rxjs';
import { CountryData, TownData, VillageData, Vote } from '../model';

@Injectable({ providedIn: 'root' })
export class AppService {
  #api = inject(HttpClient);
  // #API_PATH = 'https://jsonplaceholder.typicode.com/todos';
  #API_PATH = '/assets/data';

  // fetchData$ = this.#api.get<Vote[]>(this.#API_PATH).pipe(
  //   map((res) => res),
  //   catchError((err: unknown) => EMPTY)
  // );

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
