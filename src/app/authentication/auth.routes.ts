import { Routes } from '@angular/router';

export const authRoutes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('../noticiasp/noticiass.component').then(m => m.NewsPortalComponent),
  },
  {
    path: 'login',
    loadComponent: () =>
      import('../authentication/login/login.component').then(m => m.LoginComponent),
  },
  {
    path: 'register',
    loadComponent: () =>
      import('../authentication/register/register.component').then(m => m.RegisterComponent),
  },
  {
    path: 'recover-password',
    loadComponent: () =>
      import('../authentication/password-recovery/password-recovery.component')
        .then(m => m.PasswordRecoveryComponent),
  },
  {
    path: 'verify-code',
    loadComponent: () =>
      import('../authentication/verification-code/verification-code.component')
        .then(m => m.VerificationCodeComponent),
  }
];
