// src/app/models/payment.models.ts

export type PlanType = 'free' | 'premium';
export type PaymentStatus = 'inactive' | 'active' | 'expired';
export type TransactionStatus = 'pending' | 'completed' | 'failed';
export type PaymentMethod = 'card' | 'paypal';

export interface Plan {
  id: PlanType;
  name: string;
  price: number;
  currency: string;
  features: string[];
  popular?: boolean;
  duration: number; // días
}

export interface UserProfile {
  id: string;
  email: string;
  plan_type: PlanType;
  payment_status: PaymentStatus;
  subscription_start?: string;
  subscription_end?: string;
  created_at: string;
  updated_at: string;
}

export interface Payment {
  id?: string;
  user_id: string;
  plan_type: PlanType;
  amount: number;
  currency: string;
  payment_method: PaymentMethod;
  status: TransactionStatus;
  card_last_digits?: string;
  transaction_id?: string;
  created_at?: string;
}

export interface PaymentFormData {
  cardNumber: string;
  cardName: string;
  expiryDate: string;
  cvv: string;
  paymentMethod: PaymentMethod;
}

export const AVAILABLE_PLANS: Plan[] = [
  {
    id: 'free',
    name: 'Plan Gratuito',
    price: 0,
    currency: 'USD',
    duration: 365, // 1 año
    features: [
      'Acceso a noticias básicas',
      'Hasta 10 artículos por día',
      'Actualizaciones semanales',
      'Soporte por email'
    ]
  },
  {
    id: 'premium',
    name: 'Plan Premium',
    price: 9.99,
    currency: 'USD',
    duration: 30, // 30 días
    popular: true,
    features: [
      'Acceso ilimitado a todas las noticias',
      'Sin anuncios',
      'Noticias en tiempo real',
      'Contenido exclusivo',
      'Análisis detallados',
      'Soporte prioritario 24/7',
      'Descarga de artículos offline'
    ]
  }
];
