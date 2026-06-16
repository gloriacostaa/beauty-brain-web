import {Component, inject} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormBuilder, ReactiveFormsModule, Validators} from '@angular/forms';
import {Router, RouterLink} from '@angular/router';
import {MessageService} from 'primeng/api';
import {AuthService} from '../../../core/services/auth.service';
import {InputTextModule} from 'primeng/inputtext';
import {PasswordModule} from 'primeng/password';
import {ButtonModule} from 'primeng/button';
import {RippleModule} from 'primeng/ripple';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink,
    InputTextModule, PasswordModule, ButtonModule, RippleModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  private fb     = inject(FormBuilder);
  private auth   = inject(AuthService);
  private router = inject(Router);
  private msg    = inject(MessageService);

  form = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    senha: ['', [Validators.required, Validators.minLength(6)]]
  });

  loading = false;

  invalid(field: string) {
    const c = this.form.get(field);
    return c?.invalid && c?.touched;
  }

  submit() {
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }
    this.loading = true;
    this.auth.login(this.form.value as any).subscribe({
      next: res => {
        this.router.navigate([(res.role === 'ADMIN' || res.role === 'PROFISSIONAL') ? '/agendamentos/aprovacoes' : '/agenda/minha']);
      },
      error: () => {
        this.msg.add({ severity: 'error', summary: 'Erro', detail: 'E-mail ou senha incorretos' });
        this.loading = false;
      }
    });
  }
}
