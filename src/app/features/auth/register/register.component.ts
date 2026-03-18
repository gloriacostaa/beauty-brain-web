import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { inject } from '@angular/core';
import { MessageService } from 'primeng/api';
import { AuthService } from '../../../core/services/auth.service';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { ButtonModule } from 'primeng/button';
import { RippleModule } from 'primeng/ripple';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink,
    InputTextModule, PasswordModule, ButtonModule, RippleModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss'
})
export class RegisterComponent {
  private fb     = inject(FormBuilder);
  private auth   = inject(AuthService);
  private router = inject(Router);
  private msg    = inject(MessageService);

  form = this.fb.group({
    nome:     ['', Validators.required],
    email:    ['', [Validators.required, Validators.email]],
    telefone: [''],
    senha:    ['', [Validators.required, Validators.minLength(6)]]
  });

  loading = false;

  invalid(f: string) {
    const c = this.form.get(f);
    return c?.invalid && c?.touched;
  }

  submit() {
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }
    this.loading = true;
    this.auth.register(this.form.value as any).subscribe({
      next: () => this.router.navigate(['/agenda/minha']),
      error: (err: any) => {
        this.msg.add({ severity: 'error', summary: 'Erro', detail: err.error?.message || 'E-mail já cadastrado' });
        this.loading = false;
      }
    });
  }
}

