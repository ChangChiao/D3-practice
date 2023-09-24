import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { EMPTY, catchError, map } from 'rxjs';

@Injectable()
export class CounterService {
  #api = inject(HttpClient);
  #API_PATH = 'https://jsonplaceholder.typicode.com/posts';

  fetchData$ = this.#api.get<number>(this.#API_PATH).pipe(
    map((res) => res.data),
    catchError((err: unknown) => EMPTY)
  );
}
