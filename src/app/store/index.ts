import { Injectable } from '@angular/core';
import { ComponentStore, tapResponse } from '@ngrx/component-store';
import { TodoState } from '../model/todo.model';
import { EMPTY, catchError, map } from 'rxjs';

const initState = {
  todo: [],
};

@Injectable({ providedIn: 'root' })
export class TodoStore extends ComponentStore<TodoState> {
  readonly counter$ = this.#service.fetchData$.pipe(
    map((data) => data),
    catchError(() => EMPTY)
  );

  constructor() {
    super(initState);
  }
}
