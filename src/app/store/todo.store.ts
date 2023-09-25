import { Injectable, inject } from '@angular/core';
import { ComponentStore, tapResponse } from '@ngrx/component-store';
import { Todo, TodoState } from '../model/todo.model';
import { EMPTY, catchError, map } from 'rxjs';
import { CounterService } from '../service';

const initState = {
  todo: [],
};

export const TODO_KEY = 'todo';

@Injectable({ providedIn: 'root' })
export class TodoStore extends ComponentStore<TodoState> {
  #service = inject(CounterService);

  readonly counter$ = this.#service.fetchData$.pipe(
    map((data) => data),
    catchError(() => EMPTY)
  );

  readonly #counter$ = this.select(({ todo }) => todo);
  readonly vm$ = this.select(
    this.#counter$,
    // this.#loading$,
    (todo) => ({ data: todo }),
    {
      debounce: true,
    }
  );

  readonly setTodo = this.updater((state, payload: Todo[]) => ({
    todo: payload,
  }));

  constructor() {
    super(initState);
  }
}
