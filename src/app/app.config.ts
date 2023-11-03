import { APP_INITIALIZER, ApplicationConfig } from '@angular/core';
import {
  provideRouter,
  withEnabledBlockingInitialNavigation,
} from '@angular/router';
import { providerStoreConfig } from './configs/store.config';
import { appRoutes } from './app.routes';
import { provideHttpClient } from '@angular/common/http';
import { IconRegistryService } from './service/icon-registry.service';
import { provideAnimations } from '@angular/platform-browser/animations';
import { AppService } from './service/app.service';

function initSetup(appService: AppService) {
  return () => {
    return new Promise<void>((resolve) => {
      appService.initialize(resolve);
    });
  };
}

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(appRoutes, withEnabledBlockingInitialNavigation()),
    provideHttpClient(),
    provideAnimations(),
    ...providerStoreConfig(),
    // provideState(TODO_KEY, TodoStore),
    {
      provide: APP_INITIALIZER,
      useFactory: (iconRegistryService: IconRegistryService) => () =>
        iconRegistryService.init(),
      deps: [IconRegistryService],
      multi: true,
    },
    {
      provide: APP_INITIALIZER,
      useFactory: initSetup,
      deps: [AppService],
      multi: true,
    },
  ],
};
