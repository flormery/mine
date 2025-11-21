// src/app/premium/premium-content.component.ts
// Ejemplo de contenido premium protegido

import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PaymentService } from '../services/payment.service';
import { UserProfile } from '../models/payment.models';

@Component({
  selector: 'app-premium-content',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 py-12 px-4">
      <div class="max-w-4xl mx-auto">
        <!-- Premium Badge -->
        <div class="text-center mb-8">
          <span class="inline-flex items-center gap-2 bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-6 py-3 rounded-full font-bold text-lg shadow-lg">
            <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
            </svg>
            CONTENIDO PREMIUM
          </span>
        </div>

        <!-- User Info Card -->
        <div *ngIf="userProfile" class="bg-white rounded-2xl shadow-xl p-8 mb-8">
          <h2 class="text-2xl font-bold text-gray-900 mb-4">
            ¡Bienvenido, Usuario Premium! 🎉
          </h2>

          <div class="grid md:grid-cols-2 gap-6">
            <div class="space-y-3">
              <div class="flex items-center gap-3">
                <svg class="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
                </svg>
                <div>
                  <p class="text-sm text-gray-600">Email</p>
                  <p class="font-semibold">{{ userProfile.email }}</p>
                </div>
              </div>

              <div class="flex items-center gap-3">
                <svg class="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
                <div>
                  <p class="text-sm text-gray-600">Plan Activo</p>
                  <p class="font-semibold text-green-600">{{ userProfile.plan_type | uppercase }}</p>
                </div>
              </div>
            </div>

            <div class="space-y-3">
              <div class="flex items-center gap-3">
                <svg class="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                </svg>
                <div>
                  <p class="text-sm text-gray-600">Inicio de Suscripción</p>
                  <p class="font-semibold">{{ formatDate(userProfile.subscription_start) }}</p>
                </div>
              </div>

              <div class="flex items-center gap-3">
                <svg class="w-5 h-5 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
                <div>
                  <p class="text-sm text-gray-600">Válido Hasta</p>
                  <p class="font-semibold">{{ formatDate(userProfile.subscription_end) }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Premium Features -->
        <div class="bg-white rounded-2xl shadow-xl p-8">
          <h3 class="text-xl font-bold text-gray-900 mb-6">
            Beneficios Exclusivos Premium
          </h3>

          <div class="grid md:grid-cols-3 gap-6">
            <div class="text-center p-6 bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl">
              <div class="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
                </svg>
              </div>
              <h4 class="font-bold text-gray-900 mb-2">Sin Límites</h4>
              <p class="text-sm text-gray-600">Acceso ilimitado a todo el contenido</p>
            </div>

            <div class="text-center p-6 bg-gradient-to-br from-green-50 to-teal-50 rounded-xl">
              <div class="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
              </div>
              <h4 class="font-bold text-gray-900 mb-2">Sin Anuncios</h4>
              <p class="text-sm text-gray-600">Experiencia completamente libre de publicidad</p>
            </div>

            <div class="text-center p-6 bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl">
              <div class="w-16 h-16 bg-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01"></path>
                </svg>
              </div>
              <h4 class="font-bold text-gray-900 mb-2">Contenido Exclusivo</h4>
              <p class="text-sm text-gray-600">Análisis y reportes especiales</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: []
})
export class PremiumContentComponent implements OnInit {
  userProfile: UserProfile | null = null;

  constructor(private paymentService: PaymentService) {}

  async ngOnInit() {
    this.paymentService.userProfile$.subscribe(profile => {
      this.userProfile = profile;
    });
  }

  formatDate(dateString: string | undefined): string {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }
}
