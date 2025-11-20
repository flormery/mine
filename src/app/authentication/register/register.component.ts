import { Component } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import Swal from 'sweetalert2';
import { supabase } from '../../../supabaseClients';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, ReactiveFormsModule],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  // Propiedades del formulario
  email: string = '';
  password: string = '';
  confirmPassword: string = '';
  acceptTerms: boolean = false;

  // Estados de UI
  showPassword: boolean = false;
  isLoading: boolean = false;
  passwordStrength: string = 'weak';
  passwordStrengthLevel: number = 0;

  constructor(private router: Router) {}

  /**
   * Alterna la visibilidad de la contraseña
   */
  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }

  /**
   * Verifica la fortaleza de la contraseña
   */
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

  /**
   * Procesa el registro del usuario con Supabase
   */
  async register(): Promise<void> {
    // Validar que las contraseñas coincidan
    if (this.password !== this.confirmPassword) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Las contraseñas no coinciden',
        confirmButtonColor: '#667eea'
      });
      return;
    }

    // Validar términos
    if (!this.acceptTerms) {
      Swal.fire({
        icon: 'warning',
        title: 'Atención',
        text: 'Debes aceptar los términos y condiciones',
        confirmButtonColor: '#667eea'
      });
      return;
    }

    // Iniciar loading
    this.isLoading = true;

    try {
      const { error } = await supabase.auth.signUp({
        email: this.email,
        password: this.password,
      });

      if (error) throw error;

      // Mostrar mensaje de éxito
      await Swal.fire({
        icon: 'success',
        title: 'Registro exitoso',
        text: 'Revisa tu correo para confirmar tu cuenta',
        confirmButtonColor: '#667eea'
      });

      // Redirigir al login
      this.router.navigate(['/login']);

    } catch (err: any) {
      console.error('Error en registro:', err);

      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: err.message || 'No se pudo completar el registro',
        confirmButtonColor: '#667eea'
      });
    } finally {
      this.isLoading = false;
    }
  }
}
