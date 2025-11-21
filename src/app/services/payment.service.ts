// src/app/services/payment.service.ts

import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { supabase } from '../../supabaseClients';
import {
  UserProfile,
  Payment,
  PaymentFormData,
  PlanType,
  AVAILABLE_PLANS
} from '../models/payment.models';

@Injectable({
  providedIn: 'root'
})
export class PaymentService {
  private userProfileSubject = new BehaviorSubject<UserProfile | null>(null);
  public userProfile$ = this.userProfileSubject.asObservable();

  constructor() {
    this.initializeUserProfile();
  }

  /**
   * Inicializa el perfil del usuario actual
   */
  private async initializeUserProfile(): Promise<void> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        await this.loadUserProfile(user.id);
      }
    } catch (error) {
      console.error('Error initializing user profile:', error);
    }
  }

  /**
   * Carga el perfil del usuario desde la base de datos
   */
  async loadUserProfile(userId: string): Promise<UserProfile | null> {
    try {
      const { data, error } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) throw error;

      this.userProfileSubject.next(data);
      return data;
    } catch (error) {
      console.error('Error loading user profile:', error);
      return null;
    }
  }

  /**
   * Crea el perfil del usuario después del registro
   */
  async createUserProfile(
    userId: string,
    email: string,
    planType: PlanType = 'free'
  ): Promise<UserProfile | null> {
    try {
      const subscriptionStart = new Date().toISOString();
      const plan = AVAILABLE_PLANS.find(p => p.id === planType);
      const subscriptionEnd = new Date(
        Date.now() + (plan?.duration || 365) * 24 * 60 * 60 * 1000
      ).toISOString();

      const profile: Partial<UserProfile> = {
        id: userId,
        email,
        plan_type: planType,
        payment_status: planType === 'free' ? 'active' : 'inactive',
        subscription_start: subscriptionStart,
        subscription_end: subscriptionEnd
      };

      const { data, error } = await supabase
        .from('user_profiles')
        .insert(profile)
        .select()
        .single();

      if (error) throw error;

      this.userProfileSubject.next(data);
      return data;
    } catch (error) {
      console.error('Error creating user profile:', error);
      return null;
    }
  }

  /**
   * Procesa un pago simulado
   */
  async processPayment(
    userId: string,
    planType: PlanType,
    paymentFormData: PaymentFormData
  ): Promise<{ success: boolean; payment?: Payment; error?: string }> {
    try {
      // Simular delay de procesamiento
      await this.simulatePaymentProcessing();

      // Validar tarjeta (simulado)
      if (!this.validateCard(paymentFormData.cardNumber)) {
        return {
          success: false,
          error: 'Número de tarjeta inválido'
        };
      }

      // Crear transacción
      const plan = AVAILABLE_PLANS.find(p => p.id === planType);
      if (!plan) {
        return { success: false, error: 'Plan no encontrado' };
      }

      const payment: Partial<Payment> = {
        user_id: userId,
        plan_type: planType,
        amount: plan.price,
        currency: plan.currency,
        payment_method: paymentFormData.paymentMethod,
        status: 'completed',
        card_last_digits: paymentFormData.cardNumber.slice(-4),
        transaction_id: this.generateTransactionId()
      };

      const { data: paymentData, error: paymentError } = await supabase
        .from('payments')
        .insert(payment)
        .select()
        .single();

      if (paymentError) throw paymentError;

      // Actualizar perfil del usuario
      const subscriptionStart = new Date().toISOString();
      const subscriptionEnd = new Date(
        Date.now() + plan.duration * 24 * 60 * 60 * 1000
      ).toISOString();

      const { error: profileError } = await supabase
        .from('user_profiles')
        .update({
          plan_type: planType,
          payment_status: 'active',
          subscription_start: subscriptionStart,
          subscription_end: subscriptionEnd
        })
        .eq('id', userId);

      if (profileError) throw profileError;

      // Recargar perfil
      await this.loadUserProfile(userId);

      return { success: true, payment: paymentData };
    } catch (error: any) {
      console.error('Error processing payment:', error);
      return {
        success: false,
        error: error.message || 'Error procesando el pago'
      };
    }
  }

  /**
   * Activa plan gratuito
   */
  async activateFreePlan(userId: string): Promise<boolean> {
    try {
      const plan = AVAILABLE_PLANS.find(p => p.id === 'free');
      const subscriptionStart = new Date().toISOString();
      const subscriptionEnd = new Date(
        Date.now() + (plan?.duration || 365) * 24 * 60 * 60 * 1000
      ).toISOString();

      const { error } = await supabase
        .from('user_profiles')
        .update({
          plan_type: 'free',
          payment_status: 'active',
          subscription_start: subscriptionStart,
          subscription_end: subscriptionEnd
        })
        .eq('id', userId);

      if (error) throw error;

      await this.loadUserProfile(userId);
      return true;
    } catch (error) {
      console.error('Error activating free plan:', error);
      return false;
    }
  }

  /**
   * Obtiene el historial de pagos del usuario
   */
  async getUserPayments(userId: string): Promise<Payment[]> {
    try {
      const { data, error } = await supabase
        .from('payments')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching payments:', error);
      return [];
    }
  }

  /**
   * Verifica si el usuario tiene un plan activo
   */
  isPremiumActive(): boolean {
    const profile = this.userProfileSubject.value;
    if (!profile) return false;

    return (
      profile.plan_type === 'premium' &&
      profile.payment_status === 'active' &&
      profile.subscription_end !== undefined &&
      new Date(profile.subscription_end) > new Date()
    );
  }

  /**
   * Obtiene el perfil actual del usuario
   */
  getCurrentProfile(): UserProfile | null {
    return this.userProfileSubject.value;
  }

  // Métodos auxiliares privados

  private simulatePaymentProcessing(): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, 2000));
  }

  private validateCard(cardNumber: string): boolean {
    // Algoritmo de Luhn (simplificado para simulación)
    const cleaned = cardNumber.replace(/\s/g, '');
    return cleaned.length >= 13 && cleaned.length <= 19 && /^\d+$/.test(cleaned);
  }

  private generateTransactionId(): string {
    return `TXN-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
  }
}
