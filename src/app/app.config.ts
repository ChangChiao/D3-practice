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
import { AppService } from './service';

function initializeAppFactory(service: AppService) {
  return () => service.initService();
}

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(appRoutes, withEnabledBlockingInitialNavigation()),
    provideHttpClient(),
    provideAnimations(),
    {
      provide: APP_INITIALIZER,
      useFactory: initializeAppFactory,
      deps: [AppService],
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
