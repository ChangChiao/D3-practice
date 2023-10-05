import { Route } from '@angular/router';
import { RwdComponent } from './rwd.component';

const rwdResolver = () => {
  return rwdResolverFn();
};
const rwdResolverFn = () => {
  return null;
};
export const RWD_PAGE_ROUTES: Route[] = [
  {
    path: '',
    component: RwdComponent,
    resolve: {
      services: rwdResolver,
    },
  },
];
