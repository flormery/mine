// src/app/app.routes.ts

import { Routes } from '@angular/router';
import { LoginComponent } from './authentication/login/login.component';
import { RegisterComponent } from './authentication/register/register.component';
import { authRoutes } from './authentication/auth.routes';
import { premiumGuard } from './guards/premium.guard';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./noticiasp/noticiass.component').then(m => m.NewsPortalComponent),
  },
  {
    path: 'auth',
    children: authRoutes
  },
  {
    path: 'login',
    component: LoginComponent
  },
  {
    path: 'register',
    component: RegisterComponent
  },
  // Rutas de Pago
  {
    path: 'payment',
    children: [
      {
        path: 'plans',
        loadComponent: () =>
          import('./payment/plan-selection/plan-selection.component').then(
            m => m.PlanSelectionComponent
          )
      },
      {
        path: 'checkout',
        loadComponent: () =>
          import('./payment/checkout/checkout.component').then(
            m => m.CheckoutComponent
          )
      }
    ]
  },
  // Ejemplo de ruta premium protegida
  {
    path: 'premium-content',
    loadComponent: () =>
      import('./premium/premium-content.component').then(
        m => m.PremiumContentComponent
      ),
    canActivate: [premiumGuard]
  }
];
