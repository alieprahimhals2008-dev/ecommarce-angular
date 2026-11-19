import { ApplicationConfig, importProvidersFrom, provideBrowserGlobalErrorListeners } from '@angular/core';
import {CookieService} from 'ngx-cookie-service';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { provideClientHydration } from '@angular/platform-browser';
import { provideHttpClient, withFetch, withInterceptors } from '@angular/common/http';
import { headerInterceptor } from './core/interceptors/Header/header-interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    
    importProvidersFrom(CookieService),
    provideHttpClient(withFetch(),withInterceptors([headerInterceptor])),
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes),
     provideClientHydration()
  ]
};
