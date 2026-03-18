import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ProcedimentoService } from '../../core/services/procedimento.service';
import { AuthService } from '../../core/services/auth.service';
import { Procedimento } from '../../core/models/models';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { SkeletonModule } from 'primeng/skeleton';
import { DialogModule } from 'primeng/dialog';
import { RippleModule } from 'primeng/ripple';

@Component({
  selector: 'app-catalogo',
  standalone: true,
  imports: [CommonModule, FormsModule, ButtonModule, InputTextModule, SkeletonModule, DialogModule, RippleModule],
  templateUrl: './catalogo.component.html',
  styleUrl: './catalogo.component.scss'
})
export class CatalogoComponent implements OnInit {
  auth = inject(AuthService);
  router = inject(Router);
  private svc = inject(ProcedimentoService);

  procedimentos: Procedimento[] = [];
  loading = true;
  busca = '';
  detailVisible = false;
  detailing: Procedimento | null = null;

  ngOnInit() {
    this.svc.listar().subscribe({
      next: data => { this.procedimentos = data; this.loading = false; },
      error: () => this.loading = false
    });
  }

  filtrados() {
    if (!this.busca.trim()) return this.procedimentos;
    const t = this.busca.toLowerCase();
    return this.procedimentos.filter(p =>
      p.nome.toLowerCase().includes(t) || p.descricao?.toLowerCase().includes(t)
    );
  }

  openDetail(p: Procedimento) { this.detailing = p; this.detailVisible = true; }

  agendar(_p: Procedimento) {
    this.detailVisible = false;
    this.router.navigate(['/agendamentos/novo']);
  }
}

