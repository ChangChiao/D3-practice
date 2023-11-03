import { Route } from '@angular/router';
import { AnimationComponent } from './animation.component';

const animationResolver = () => {
  return animationResolverFn();
};
const animationResolverFn = () => {
  return null;
};
export const ANIMATION_PAGE_ROUTES: Route[] = [
  {
    path: '',
    component: AnimationComponent,
    resolve: {
      services: animationResolver,
    },
    // providers: [Service, PageStore],
  },
];
