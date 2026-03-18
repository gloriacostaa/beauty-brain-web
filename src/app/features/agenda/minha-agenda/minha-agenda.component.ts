import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { inject } from '@angular/core';
import { MessageService } from 'primeng/api';
import { AgendamentoService } from '../../../core/services/agendamento.service';
import { Agendamento, StatusAgendamento } from '../../../core/models/models';
import { TagModule } from 'primeng/tag';
import { ButtonModule } from 'primeng/button';
import { SkeletonModule } from 'primeng/skeleton';

type Severity = 'success' | 'info' | 'warn' | 'danger' | 'secondary' | 'contrast';

@Component({
  selector: 'app-minha-agenda',
  standalone: true,
  imports: [CommonModule, TagModule, ButtonModule, SkeletonModule],
  templateUrl: './minha-agenda.component.html',
  styleUrl: './minha-agenda.component.scss'
})
export class MinhaAgendaComponent implements OnInit {
  router  = inject(Router);
  private svc = inject(AgendamentoService);
  private msg = inject(MessageService);

  agendamentos: Agendamento[] = [];
  loading = true;
  filtroAtivo: StatusAgendamento | 'TODOS' = 'TODOS';

  filtros = [
    { label: 'Todos',      value: 'TODOS'     as const },
    { label: 'Pendentes',  value: 'PENDENTE'  as const },
    { label: 'Aprovados',  value: 'APROVADO'  as const },
    { label: 'Recusados',  value: 'RECUSADO'  as const },
    { label: 'Cancelados', value: 'CANCELADO' as const },
  ];

  ngOnInit() {
    this.svc.listarMeus().subscribe({
      next: data => { this.agendamentos = data; this.loading = false; },
      error: () => this.loading = false
    });
  }

  filtrados() {
    if (this.filtroAtivo === 'TODOS') return this.agendamentos;
    return this.agendamentos.filter(a => a.status === this.filtroAtivo);
  }

  contar(s: StatusAgendamento | 'TODOS') {
    if (s === 'TODOS') return this.agendamentos.length;
    return this.agendamentos.filter(a => a.status === s).length;
  }

  statusLabel(s: StatusAgendamento): string {
    return { PENDENTE: 'Pendente', APROVADO: 'Aprovado', RECUSADO: 'Recusado', CANCELADO: 'Cancelado' }[s];
  }

  statusSeverity(s: StatusAgendamento): Severity {
    return ({ PENDENTE: 'warn', APROVADO: 'success', RECUSADO: 'danger', CANCELADO: 'secondary' } as any)[s];
  }

  cancelar(a: Agendamento) {
    this.svc.cancelar(a.id).subscribe({
      next: () => {
        this.msg.add({ severity: 'info', summary: 'Cancelado', detail: 'Agendamento cancelado.' });
        a.status = 'CANCELADO';
      },
      error: () => this.msg.add({ severity: 'error', summary: 'Erro', detail: 'Não foi possível cancelar.' })
    });
  }
}

