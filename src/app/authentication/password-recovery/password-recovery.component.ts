import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  standalone: true,
  selector: 'app-password-recovery',
  templateUrl: './password-recovery.component.html',
  styleUrls: ['./password-recovery.component.css'],
  imports: [FormsModule, CommonModule]
})
export class PasswordRecoveryComponent {

  email: string = '';

  verificar() {
    console.log("Enviando correo de verificación...");
  }
}
