import { Route } from '@angular/router';
import { OverviewComponent } from './overview.component';

const overviewResolver = () => {
  return overviewResolverFn();
};
const overviewResolverFn = () => {
  return null;
};
export const OVERVIEW_PAGE_ROUTES: Route[] = [
  {
    path: '',
    component: OverviewComponent,
    resolve: {
      services: overviewResolver,
    },
    // providers: [Service, PageStore],
  },
];
