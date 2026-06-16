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
import { TooltipModule } from 'primeng/tooltip';

type Severity = 'success' | 'info' | 'warn' | 'danger' | 'secondary' | 'contrast';

@Component({
  selector: 'app-minha-agenda',
  standalone: true,
  imports: [CommonModule, TagModule, ButtonModule, SkeletonModule, TooltipModule],
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

  imprimir(a: Agendamento) {
    const fmt = (d: string) => new Date(d).toLocaleString('pt-BR', { dateStyle: 'long', timeStyle: 'short' });
    const preco = a.procedimentoPreco != null
      ? a.procedimentoPreco.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
      : '—';

    const html = `<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8"/>
  <title>Comprovante de Agendamento #${a.id}</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body { font-family: 'Segoe UI', Arial, sans-serif; color: #1e293b; padding: 40px; max-width: 600px; margin: auto; }
    .logo { font-size: 22px; font-weight: 700; color: #7c3aed; margin-bottom: 4px; }
    .subtitle { font-size: 13px; color: #64748b; margin-bottom: 28px; }
    h2 { font-size: 18px; font-weight: 600; margin-bottom: 20px; border-bottom: 2px solid #e2e8f0; padding-bottom: 10px; }
    .badge { display: inline-block; background: #dcfce7; color: #16a34a; font-size: 12px; font-weight: 700;
             padding: 3px 12px; border-radius: 100px; margin-bottom: 20px; }
    table { width: 100%; border-collapse: collapse; margin-bottom: 24px; }
    td { padding: 10px 8px; border-bottom: 1px solid #f1f5f9; font-size: 14px; }
    td:first-child { color: #64748b; font-weight: 500; width: 40%; }
    td:last-child { font-weight: 600; }
    .footer { font-size: 12px; color: #94a3b8; text-align: center; margin-top: 32px; }
    @media print { body { padding: 20px; } }
  </style>
</head>
<body>
  <div class="logo">Beauty Brain</div>
  <div class="subtitle">Comprovante de Agendamento</div>
  <h2>Detalhes do Agendamento #${a.id}</h2>
  <span class="badge">✔ Aprovado</span>
  <table>
    <tr><td>Cliente</td><td>${a.usuarioNome}</td></tr>
    <tr><td>Serviço</td><td>${a.procedimentoNome}</td></tr>
    <tr><td>Profissional</td><td>${a.profissionalNome}</td></tr>
    <tr><td>Data & Hora</td><td>${fmt(a.inicio)} – ${new Date(a.fim).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}</td></tr>
    <tr><td>Valor</td><td>${preco}</td></tr>
    ${a.observacao ? `<tr><td>Observação</td><td>${a.observacao}</td></tr>` : ''}
  </table>
  <div class="footer">Documento gerado em ${new Date().toLocaleString('pt-BR')} · Beauty Brain</div>
  <script>window.onload = () => { window.print(); }<\/script>
</body>
</html>`;

    const win = window.open('', '_blank', 'width=700,height=600');
    if (win) {
      win.document.write(html);
      win.document.close();
    }
  }
}

