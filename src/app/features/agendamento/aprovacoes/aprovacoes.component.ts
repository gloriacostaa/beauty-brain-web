import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { inject } from '@angular/core';
import { MessageService } from 'primeng/api';
import { AgendamentoService } from '../../../core/services/agendamento.service';
import { Agendamento } from '../../../core/models/models';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { TextareaModule } from 'primeng/textarea';
import { InputTextModule } from 'primeng/inputtext';
import { SkeletonModule } from 'primeng/skeleton';

@Component({
  selector: 'app-aprovacoes',
  standalone: true,
  imports: [CommonModule, FormsModule,
    TableModule, TagModule, ButtonModule, DialogModule,
    TextareaModule, InputTextModule, SkeletonModule],
  templateUrl: './aprovacoes.component.html',
  styleUrl: './aprovacoes.component.scss'
})
export class AprovacoesComponent implements OnInit {
  private svc = inject(AgendamentoService);
  private msg = inject(MessageService);

  pendentes: Agendamento[] = [];
  loading = true;
  recusaVisible = false;
  recusando: Agendamento | null = null;
  motivoRecusa = '';

  ngOnInit() { this.carregar(); }

  carregar() {
    this.loading = true;
    this.svc.listarPendentes().subscribe({
      next: data => { this.pendentes = data; this.loading = false; },
      error: () => this.loading = false
    });
  }

  initials(nome: string) {
    return nome?.split(' ').map(n => n[0]).slice(0, 2).join('').toUpperCase() || '?';
  }

  aprovar(a: Agendamento) {
    this.svc.aprovar(a.id).subscribe({
      next: () => {
        this.msg.add({ severity: 'success', summary: 'Aprovado!', detail: `Agendamento de ${a.usuarioNome} aprovado.` });
        this.carregar();
      },
      error: () => this.msg.add({ severity: 'error', summary: 'Erro', detail: 'Não foi possível aprovar.' })
    });
  }

  openRecusa(a: Agendamento) {
    this.recusando = a;
    this.motivoRecusa = '';
    this.recusaVisible = true;
  }

  recusar() {
    if (!this.recusando || !this.motivoRecusa.trim()) return;
    this.svc.recusar(this.recusando.id, { motivoRecusa: this.motivoRecusa }).subscribe({
      next: () => {
        this.msg.add({ severity: 'warn', summary: 'Recusado', detail: `Agendamento de ${this.recusando?.usuarioNome} recusado.` });
        this.recusaVisible = false;
        this.carregar();
      },
      error: () => this.msg.add({ severity: 'error', summary: 'Erro', detail: 'Não foi possível recusar.' })
    });
  }
}

