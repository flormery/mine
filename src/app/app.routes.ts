import { LoginComponent } from './authentication/login/login.component';
import { Routes } from '@angular/router';
import { authRoutes } from './authentication/auth.routes';
import { RegisterComponent } from './authentication/register/register.component';

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
{ path: 'register',
  component: RegisterComponent }
];
