// src/app/payment/checkout/checkout.component.ts

import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { PaymentService } from '../../services/payment.service';
import { AVAILABLE_PLANS, Plan, PaymentFormData } from '../../models/payment.models';
import { supabase } from '../../../supabaseClients';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './checkout.component.html',
  styleUrl: './checkout.component.css'
})
export class CheckoutComponent implements OnInit {
  selectedPlan: Plan | null = null;
  isProcessing = false;
  currentUserId: string | null = null;

  formData: PaymentFormData = {
    cardNumber: '',
    cardName: '',
    expiryDate: '',
    cvv: '',
    paymentMethod: 'card'
  };

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private paymentService: PaymentService
  ) {}

  async ngOnInit() {
    const { data: { user } } = await supabase.auth.getUser();
    this.currentUserId = user?.id || null;

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

    this.route.queryParams.subscribe(params => {
      const planId = params['plan'];
      this.selectedPlan = AVAILABLE_PLANS.find(p => p.id === planId) || null;

      if (!this.selectedPlan || this.selectedPlan.id === 'free') {
        this.router.navigate(['/payment/plans']);
      }
    });
  }

  cerrarVentana() {
    this.router.navigate(['/payment/plans']);
  }

  formatCardNumber(event: any) {
    let value = event.target.value.replace(/\s/g, '');
    let formattedValue = value.match(/.{1,4}/g)?.join(' ') || value;
    this.formData.cardNumber = formattedValue;
  }

  formatExpiryDate(event: any) {
    let value = event.target.value.replace(/\D/g, '');
    if (value.length >= 2) {
      value = value.slice(0, 2) + '/' + value.slice(2, 4);
    }
    this.formData.expiryDate = value;
  }

  async processPayment() {
    if (!this.currentUserId || !this.selectedPlan) return;

    this.isProcessing = true;

    // Mostrar loader
    Swal.fire({
      title: 'Procesando pago',
      html: 'Por favor espera...',
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      }
    });

    try {
      const result = await this.paymentService.processPayment(
        this.currentUserId,
        this.selectedPlan.id,
        this.formData
      );

      Swal.close();

      if (result.success) {
        await Swal.fire({
          icon: 'success',
          title: '¡Pago Exitoso!',
          html: `
            <div class="text-left">
              <p class="mb-2"><strong>Plan:</strong> ${this.selectedPlan.name}</p>
              <p class="mb-2"><strong>Monto:</strong> $${this.selectedPlan.price}</p>
              <p class="mb-2"><strong>ID de Transacción:</strong> ${result.payment?.transaction_id}</p>
            </div>
          `,
          confirmButtonColor: '#10b981'
        });

        this.router.navigate(['/']);
      } else {
        await Swal.fire({
          icon: 'error',
          title: 'Error en el pago',
          text: result.error || 'No se pudo procesar el pago',
          confirmButtonColor: '#10b981'
        });
      }
    } catch (error) {
      console.error('Payment error:', error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Ocurrió un error inesperado',
        confirmButtonColor: '#10b981'
      });
    } finally {
      this.isProcessing = false;
    }
  }
}
