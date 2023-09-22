import { Route } from '@angular/router';
import { DetailComponent } from './detail.component';

const detailResolver = () => {
  return detailResolverFn();
};
const detailResolverFn = () => {
  return null;
};
export const DETAIL_PAGE_ROUTES: Route[] = [
  {
    path: '',
    component: DetailComponent,
    resolve: {
      services: detailResolver,
    },
    // providers: [Service, PageStore],
  },
];
