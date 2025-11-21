// src/app/payment/plan-selection/plan-selection.component.ts

import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { PaymentService } from '../../services/payment.service';
import { AVAILABLE_PLANS, Plan } from '../../models/payment.models';
import { supabase } from '../../../supabaseClients';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-plan-selection',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './plan-selection.component.html',
  styleUrl: './plan-selection.component.css'
})
export class PlanSelectionComponent implements OnInit {
  plans = AVAILABLE_PLANS;
  isLoading = false;
  currentUserId: string | null = null;

  constructor(
    private paymentService: PaymentService,
    private router: Router
  ) {}

  // 👉 Método agregado para eliminar el error TS2339
  cerrarVentana() {
    this.router.navigate(['/']);
  }

  async ngOnInit() {
    const { data: { user } } = await supabase.auth.getUser();
    this.currentUserId = user?.id || null;
  }

  async selectPlan(plan: Plan) {
    if (!this.currentUserId) {
      Swal.fire({
        icon: 'warning',
        title: 'Sesión requerida',
        text: 'Debes iniciar sesión para continuar',
        confirmButtonColor: '#10b981'
      });
      this.router.navigate(['/login']);
      return;
    }

    if (plan.id === 'free') {
      await this.activateFreePlan();
    } else {
      this.router.navigate(['/payment/checkout'], {
        queryParams: { plan: plan.id }
      });
    }
  }

  private async activateFreePlan() {
    this.isLoading = true;

    try {
      const success = await this.paymentService.activateFreePlan(this.currentUserId!);

      if (success) {
        await Swal.fire({
          icon: 'success',
          title: '¡Plan Activado!',
          text: 'Tu plan gratuito ha sido activado correctamente',
          confirmButtonColor: '#10b981'
        });

        this.router.navigate(['/']);
      } else {
        throw new Error('No se pudo activar el plan');
      }
    } catch (error) {
      console.error('Error activating free plan:', error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'No se pudo activar el plan gratuito',
        confirmButtonColor: '#10b981'
      });
    } finally {
      this.isLoading = false;
    }
  }
}
