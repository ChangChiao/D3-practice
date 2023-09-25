import { TodoStore } from './../../store/todo.store';
import { Route } from '@angular/router';
import { OverviewComponent } from './overview.component';
import { inject } from '@angular/core';
import { EMPTY, catchError, tap } from 'rxjs';

const overviewResolver = () => {
  return overviewResolverFn();
};
const overviewResolverFn = (store = inject(TodoStore)) => {
  return store.counter$.pipe(
    tap((data) => {
      console.log(data);
    }),
    catchError(() => EMPTY)
  );
};
export const OVERVIEW_PAGE_ROUTES: Route[] = [
  {
    path: '',
    component: OverviewComponent,
    resolve: {
      data: overviewResolver,
    },
    // providers: [Service, PageStore],
  },
];
