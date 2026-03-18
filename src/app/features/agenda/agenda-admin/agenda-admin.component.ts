import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { inject } from '@angular/core';
import { AgendamentoService } from '../../../core/services/agendamento.service';
import { Agendamento, StatusAgendamento } from '../../../core/models/models';
import { TagModule } from 'primeng/tag';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { SkeletonModule } from 'primeng/skeleton';
import { InputTextModule } from 'primeng/inputtext';

type Severity = 'success' | 'info' | 'warn' | 'danger' | 'secondary' | 'contrast';

@Component({
  selector: 'app-agenda-admin',
  standalone: true,
  imports: [CommonModule, TagModule, ButtonModule, TableModule, SkeletonModule, InputTextModule],
  templateUrl: './agenda-admin.component.html',
  styleUrl: './agenda-admin.component.scss'
})
export class AgendaAdminComponent implements OnInit {
  private svc = inject(AgendamentoService);

  agendamentos: Agendamento[] = [];
  loading = true;

  get summaries() {
    const count = (s: StatusAgendamento) => this.agendamentos.filter(a => a.status === s).length;
    return [
      { label: 'Total',     count: this.agendamentos.length, color: '#c084fc' },
      { label: 'Aprovados', count: count('APROVADO'),  color: '#34d399' },
      { label: 'Pendentes', count: count('PENDENTE'),  color: '#fbbf24' },
      { label: 'Recusados', count: count('RECUSADO'),  color: '#f87171' },
    ];
  }

  ngOnInit() {
    this.svc.listarTodos().subscribe({
      next: data => { this.agendamentos = data; this.loading = false; },
      error: () => this.loading = false
    });
  }

  initials(nome: string) {
    return nome?.split(' ').map(n => n[0]).slice(0, 2).join('').toUpperCase() || '?';
  }

  statusLabel(s: StatusAgendamento): string {
    return { PENDENTE: 'Pendente', APROVADO: 'Aprovado', RECUSADO: 'Recusado', CANCELADO: 'Cancelado' }[s];
  }

  statusSeverity(s: StatusAgendamento): Severity {
    return ({ PENDENTE: 'warn', APROVADO: 'success', RECUSADO: 'danger', CANCELADO: 'secondary' } as any)[s];
  }
}

