import { Component, inject } from '@angular/core';
import { Router, RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from './core/services/auth.service';
import { ButtonModule } from 'primeng/button';
import { AvatarModule } from 'primeng/avatar';
import { ToastModule } from 'primeng/toast';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { RippleModule } from 'primeng/ripple';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule, RouterOutlet, RouterLink, RouterLinkActive,
    ButtonModule, AvatarModule, ToastModule, ConfirmDialogModule, RippleModule
  ],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  auth   = inject(AuthService);
  router = inject(Router);

  initials() {
    const name = this.auth.userName();
    return name ? name.split(' ').map(n => n[0]).slice(0, 2).join('').toUpperCase() : 'BB';
  }
}
