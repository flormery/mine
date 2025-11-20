import { ApplicationConfig, importProvidersFrom, provideZonelessChangeDetection, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter } from '@angular/router';

import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZonelessChangeDetection(),
    provideRouter(routes),

    // 🔥 Módulos NECESARIOS para ngModel, ngIf, ngFor, ngClass
    importProvidersFrom(CommonModule, FormsModule)
  ]
};
