// src/app/authentication/register/register.component.ts
// VERSIÓN CON MEJOR MANEJO DE ERRORES

import { Component } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import Swal from 'sweetalert2';
import { supabase } from '../../../supabaseClients';
import { PaymentService } from '../../services/payment.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, ReactiveFormsModule],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  email: string = '';
  password: string = '';
  confirmPassword: string = '';
  acceptTerms: boolean = false;
  showPassword: boolean = false;
  isLoading: boolean = false;
  passwordStrength: string = 'weak';
  passwordStrengthLevel: number = 0;

  constructor(
    private router: Router,
    private paymentService: PaymentService
  ) {}

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }

  checkPasswordStrength(): void {
    const password = this.password;
    let strength = 0;

    if (password.length >= 8) strength++;
    if (password.length >= 12) strength++;
    if (/[a-z]/.test(password) && /[A-Z]/.test(password)) strength++;
    if (/\d/.test(password)) strength++;
    if (/[^a-zA-Z0-9]/.test(password)) strength++;

    this.passwordStrengthLevel = strength;

    if (strength <= 1) {
      this.passwordStrength = 'weak';
    } else if (strength === 2) {
      this.passwordStrength = 'fair';
    } else if (strength === 3) {
      this.passwordStrength = 'good';
    } else {
      this.passwordStrength = 'strong';
    }
  }

  isValidEmail(email: string): boolean {
    // Validación más estricta
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailRegex.test(email);
  }

  async register(): Promise<void> {
    // Limpiar y normalizar email
    const cleanEmail = this.email.trim().toLowerCase();

    // Validaciones
    if (!this.isValidEmail(cleanEmail)) {
      Swal.fire({
        icon: 'error',
        title: 'Email inválido',
        html: `
          <p>El email no tiene un formato válido.</p>
          <p class="text-sm mt-2">Ejemplos válidos:</p>
          <ul class="text-sm text-left">
            <li>• usuario.nombre@gmail.com</li>
            <li>• mi.email@outlook.com</li>
            <li>• nombre.apellido@dominio.com</li>
          </ul>
        `,
        confirmButtonColor: '#667eea'
      });
      return;
    }

    // Validar longitud mínima del email (antes del @)
    const emailLocalPart = cleanEmail.split('@')[0];
    if (emailLocalPart.length < 4) {
      Swal.fire({
        icon: 'error',
        title: 'Email muy corto',
        text: 'El email debe tener al menos 4 caracteres antes del @',
        footer: 'Ejemplo: usuario@gmail.com',
        confirmButtonColor: '#667eea'
      });
      return;
    }

    if (this.password.length < 8) {
      Swal.fire({
        icon: 'error',
        title: 'Contraseña muy corta',
        text: 'La contraseña debe tener al menos 8 caracteres',
        confirmButtonColor: '#667eea'
      });
      return;
    }

    if (this.password !== this.confirmPassword) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Las contraseñas no coinciden',
        confirmButtonColor: '#667eea'
      });
      return;
    }

    if (!this.acceptTerms) {
      Swal.fire({
        icon: 'warning',
        title: 'Atención',
        text: 'Debes aceptar los términos y condiciones',
        confirmButtonColor: '#667eea'
      });
      return;
    }

    this.isLoading = true;

    try {
      console.log('🔄 Intentando registrar:', cleanEmail);

      // OPCIÓN 1: Registro sin confirmación de email
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: cleanEmail,
        password: this.password,
        options: {
          // No requiere confirmación de email
          emailRedirectTo: undefined,
          data: {
            email_confirm: false
          }
        }
      });

      if (authError) {
        console.error('❌ Error de Supabase:', authError);

        // Mensajes de error específicos
        if (authError.message.includes('invalid')) {
          throw new Error('El formato del email no es válido para Supabase. Intenta con un email más largo (ej: usuario.nombre@gmail.com)');
        } else if (authError.message.includes('already')) {
          throw new Error('Este email ya está registrado. ¿Olvidaste tu contraseña?');
        } else if (authError.message.includes('rate limit')) {
          throw new Error('Demasiados intentos. Espera unos minutos e intenta nuevamente.');
        } else {
          throw authError;
        }
      }

      console.log('✅ Usuario creado:', authData.user?.email);

      // Crear perfil de usuario
      if (authData.user) {
        console.log('🔄 Creando perfil...');
        const profileCreated = await this.paymentService.createUserProfile(
          authData.user.id,
          cleanEmail,
          'free'
        );

        if (profileCreated) {
          console.log('✅ Perfil creado');
        } else {
          console.warn('⚠️ No se pudo crear el perfil automáticamente');
        }
      }

      // Éxito
      const result = await Swal.fire({
        icon: 'success',
        title: '¡Registro exitoso!',
        html: `
          <div class="text-left">
            <p class="mb-3">Tu cuenta ha sido creada con el <strong>Plan Gratuito</strong>.</p>
            <div class="bg-blue-50 p-3 rounded-lg mb-3">
              <p class="text-sm"><strong>Email:</strong> ${cleanEmail}</p>
            </div>
            <p class="text-sm text-gray-600">Ya puedes iniciar sesión</p>
          </div>
        `,
        confirmButtonText: 'Ir al Login',
        showCancelButton: true,
        cancelButtonText: 'Ver Planes Premium',
        confirmButtonColor: '#667eea',
        cancelButtonColor: '#0ea5e9'
      });

      if (result.isConfirmed) {
        this.router.navigate(['/login']);
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        this.router.navigate(['/payment/plans']);
      }

    } catch (err: any) {
      console.error('❌ Error completo:', err);

      let errorMessage = 'No se pudo completar el registro';
      let errorFooter = '';

      if (err.message) {
        errorMessage = err.message;
      }

      // Sugerencias específicas
      if (errorMessage.includes('invalid') || errorMessage.includes('formato')) {
        errorFooter = '<small>💡 Intenta con un email más completo: usuario.nombre@gmail.com</small>';
      }

      Swal.fire({
        icon: 'error',
        title: 'Error en el registro',
        text: errorMessage,
        footer: errorFooter || '<a href="mailto:soporte@tuapp.com">¿Necesitas ayuda?</a>',
        confirmButtonColor: '#667eea'
      });
    } finally {
      this.isLoading = false;
    }
  }
}
