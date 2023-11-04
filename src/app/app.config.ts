import { APP_INITIALIZER, ApplicationConfig } from '@angular/core';
import {
  provideRouter,
  withEnabledBlockingInitialNavigation,
} from '@angular/router';

import { appRoutes } from './app.routes';
import { provideHttpClient } from '@angular/common/http';
import { IconRegistryService } from './service/icon-registry.service';
import { provideAnimations } from '@angular/platform-browser/animations';
import { AppComponentStore } from './store/app.state';
import { tap } from 'rxjs';

function initializeAppFactory(store: AppComponentStore) {
  return () => {
    store.voteData$
      .pipe(
        tap((data) => {
          console.log('data==', data);
          store.setVote(data);
        })
      )
      .subscribe();
  };
}

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(appRoutes, withEnabledBlockingInitialNavigation()),
    provideHttpClient(),
    provideAnimations(),
    {
      provide: APP_INITIALIZER,
      useFactory: initializeAppFactory,
      deps: [AppComponentStore],
      multi: true,
    },
    {
      provide: APP_INITIALIZER,
      useFactory: (iconRegistryService: IconRegistryService) => () =>
        iconRegistryService.init(),
      deps: [IconRegistryService],
      multi: true,
    },
  ],
};
