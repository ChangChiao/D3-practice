import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { EMPTY, catchError, map } from 'rxjs';
import { Vote } from '../model';

@Injectable({ providedIn: 'root' })
export class AppService {
  #api = inject(HttpClient);
  #API_PATH = 'https://jsonplaceholder.typicode.com/todos';

  fetchData$ = this.#api.get<Vote[]>(this.#API_PATH).pipe(
    map((res) => res),
    catchError((err: unknown) => EMPTY)
  );
}
