import 'zone.js';
import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { importProvidersFrom } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { provideRouter } from '@angular/router';
import { routes } from './app/app.routes'; // Asegúrate que esta ruta sea correcta

bootstrapApplication(AppComponent, {
  providers: [
    importProvidersFrom(FormsModule),
    provideRouter(routes)
  ]
}).catch(err => console.error(err));
