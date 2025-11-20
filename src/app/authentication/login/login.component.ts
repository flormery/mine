import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import Swal from 'sweetalert2';
import { supabase } from '../../../supabaseClients';

@Component({
  selector: 'app-login',
  standalone: true,
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  imports: [CommonModule, FormsModule, RouterLink]
})
export class LoginComponent {
  email: string = '';
  password: string = '';
  showPassword: boolean = false;
  isLoading: boolean = false;

  constructor(private router: Router) {}

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  async login() {
    // Validaciones básicas
    if (!this.email || !this.password) {
      Swal.fire({
        title: 'Campos incompletos',
        text: 'Por favor completa todos los campos',
        icon: 'warning',
        confirmButtonColor: '#0ea5e9',
        confirmButtonText: 'Entendido'
      });
      return;
    }

    this.isLoading = true;

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: this.email,
        password: this.password,
      });

      if (error) {
        this.isLoading = false;

        // Manejo especial para email no confirmado
        if (error.message.includes('Email not confirmed')) {
          const result = await Swal.fire({
            title: 'Email no confirmado',
            html: `
              <div style="text-align: left; padding: 10px;">
                <p>Tu email aún no ha sido confirmado.</p>
                <p style="margin-top: 10px;">Por favor revisa tu bandeja de entrada y la carpeta de spam.</p>
                <p style="margin-top: 15px; font-weight: bold;">¿No recibiste el correo?</p>
              </div>
            `,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#0ea5e9',
            cancelButtonColor: '#64748b',
            confirmButtonText: 'Reenviar correo',
            cancelButtonText: 'Cancelar'
          });

          if (result.isConfirmed) {
            await this.resendConfirmationEmail();
          }
          return;
        }

        // Otros errores
        Swal.fire({
          title: 'Error de autenticación',
          text: this.getErrorMessage(error.message),
          icon: 'error',
          confirmButtonColor: '#0ea5e9',
          confirmButtonText: 'Intentar nuevamente'
        });
        return;
      }

      // Login exitoso
      console.log('Usuario autenticado:', data);
      this.isLoading = false;

      const Toast = Swal.mixin({
        toast: true,
        position: 'top-end',
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
        didOpen: (toast) => {
          toast.addEventListener('mouseenter', Swal.stopTimer);
          toast.addEventListener('mouseleave', Swal.resumeTimer);
        }
      });

      Toast.fire({
        icon: 'success',
        title: '¡Bienvenido de nuevo!',
        text: 'Redirigiendo...'
      });

      // Redirigir después de un breve delay
      setTimeout(() => {
        // Opciones de ruta según tu app:
        // this.router.navigate(['/']);           // Página principal
        // this.router.navigate(['/dashboard']);  // Dashboard
        // this.router.navigate(['/home']);       // Home
        // this.router.navigate(['/noticias']);   // Noticias

        this.router.navigate(['/']); // Cambiar a tu ruta correcta
      }, 1500);

    } catch (e: any) {
      this.isLoading = false;
      console.error('Error en login:', e);
      Swal.fire({
        title: 'Error inesperado',
        text: 'Ha ocurrido un error. Por favor intenta nuevamente.',
        icon: 'error',
        confirmButtonColor: '#0ea5e9',
        confirmButtonText: 'Cerrar'
      });
    }
  }

  // Reenviar email de confirmación
  async resendConfirmationEmail(): Promise<void> {
    try {
      const { error } = await supabase.auth.resend({
        type: 'signup',
        email: this.email,
      });

      if (error) {
        throw error;
      }

      Swal.fire({
        title: '¡Correo enviado!',
        text: 'Revisa tu bandeja de entrada y confirma tu cuenta',
        icon: 'success',
        confirmButtonColor: '#0ea5e9',
        confirmButtonText: 'Entendido'
      });
    } catch (err: any) {
      console.error('Error al reenviar email:', err);
      Swal.fire({
        title: 'Error',
        text: 'No se pudo reenviar el correo. Intenta más tarde.',
        icon: 'error',
        confirmButtonColor: '#0ea5e9',
        confirmButtonText: 'Cerrar'
      });
    }
  }

  // Mensajes de error personalizados
  private getErrorMessage(error: string): string {
    if (error.includes('Invalid login credentials')) {
      return 'Correo electrónico o contraseña incorrectos';
    } else if (error.includes('Email not confirmed')) {
      return 'Por favor verifica tu correo electrónico';
    } else if (error.includes('User not found')) {
      return 'No existe una cuenta con este correo';
    } else if (error.includes('Invalid')) {
      return 'Credenciales inválidas. Verifica tu email y contraseña.';
    }
    return 'Error al iniciar sesión. Por favor intenta nuevamente.';
  }
}
