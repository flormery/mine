// src/app/guards/premium.guard.ts

import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';
import { PaymentService } from '../services/payment.service';
import Swal from 'sweetalert2';

export const premiumGuard: CanActivateFn = async (route, state) => {
  const paymentService = inject(PaymentService);
  const router = inject(Router);

  const isPremium = paymentService.isPremiumActive();

  if (!isPremium) {
    await Swal.fire({
      icon: 'warning',
      title: 'Contenido Premium',
      text: 'Necesitas un plan premium para acceder a este contenido',
      confirmButtonText: 'Ver Planes',
      showCancelButton: true,
      cancelButtonText: 'Volver',
      confirmButtonColor: '#0ea5e9',
      cancelButtonColor: '#64748b'
    }).then((result) => {
      if (result.isConfirmed) {
        router.navigate(['/payment/plans']);
      } else {
        router.navigate(['/']);
      }
    });

    return false;
  }

  return true;
};
