import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormControl, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { AgendamentoService } from '../../../core/services/agendamento.service';
import { ProcedimentoService } from '../../../core/services/procedimento.service';
import { ProfissionalService } from '../../../core/services/profissional.service';
import { Procedimento, Profissional, SlotDisponivel, AgendamentoRequest } from '../../../core/models/models';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { DatePickerModule } from 'primeng/datepicker';
import { TextareaModule } from 'primeng/textarea';
import { TagModule } from 'primeng/tag';
import { RippleModule } from 'primeng/ripple';
import { SkeletonModule } from 'primeng/skeleton';

@Component({
  selector: 'app-solicitar',
  standalone: true,
  imports: [
    CommonModule, ReactiveFormsModule,
    CardModule, ButtonModule, DatePickerModule,
    TextareaModule, TagModule, RippleModule, SkeletonModule
  ],
  templateUrl: './solicitar.component.html',
  styleUrl: './solicitar.component.scss'
})
export class SolicitarComponent implements OnInit {
  private readonly fb              = inject(FormBuilder);
  private readonly agendamentoSvc  = inject(AgendamentoService);
  private readonly procedimentoSvc = inject(ProcedimentoService);
  private readonly profissionalSvc = inject(ProfissionalService);
  private readonly router          = inject(Router);
  private readonly msg             = inject(MessageService);

  // Controle de passos: 1=procedimento 2=profissional 3=slot 4=confirmar
  step = 1;

  // Dados de cada etapa
  procedimentos: Procedimento[]   = [];
  profissionais: Profissional[]   = [];
  slots: SlotDisponivel[]         = [];

  selectedProc:         Procedimento   | null = null;
  selectedProfissional: Profissional   | null = null;
  selectedSlot:         SlotDisponivel | null = null;

  // Estados de carregamento
  loadingProcs  = false;
  loadingProfs  = false;
  loadingSlots  = false;
  loadingSubmit = false;

  minDate = new Date();

  // FormControl separado para o datepicker (sem reactive form wrapper)
  dataCtrl  = new FormControl<Date | null>(null);
  form      = this.fb.group({ observacao: [''] });

  // ─── Lifecycle ────────────────────────────────────────────────────────────

  ngOnInit() {
    this.loadingProcs = true;
    this.procedimentoSvc.listar().subscribe({
      next: list => { this.procedimentos = list; this.loadingProcs = false; },
      error: ()  => { this.loadingProcs = false; }
    });
  }

  // ─── Step 1: Selecionar procedimento ──────────────────────────────────────

  selectProc(p: Procedimento) {
    if (this.selectedProc?.id === p.id) return;
    this.selectedProc        = p;
    this.selectedProfissional = null;
    this.selectedSlot        = null;
    this.profissionais       = [];
    this.slots               = [];
  }

  goToStep2() {
    if (!this.selectedProc) return;
    this.step = 2;
    this.loadingProfs = true;
    this.profissionalSvc.listarPorProcedimento(this.selectedProc.id).subscribe({
      next: list => { this.profissionais = list; this.loadingProfs = false; },
      error: ()  => {
        this.loadingProfs = false;
        this.msg.add({ severity: 'error', summary: 'Erro', detail: 'Não foi possível carregar os profissionais.' });
      }
    });
  }

  // ─── Step 2: Selecionar profissional ─────────────────────────────────────

  selectProfissional(pr: Profissional) {
    if (this.selectedProfissional?.id === pr.id) return;
    this.selectedProfissional = pr;
    this.selectedSlot         = null;
    this.slots                = [];
  }

  goToStep3() {
    if (!this.selectedProfissional) return;
    this.step = 3;
  }

  // ─── Step 3: Selecionar data e slot ──────────────────────────────────────

  onDataChange(date: Date | null) {
    this.selectedSlot = null;
    this.slots        = [];
    if (!date || !this.selectedProc || !this.selectedProfissional) return;

    const data = this.formatDate(date);
    this.loadingSlots = true;
    this.profissionalSvc.listarSlotsDisponiveis({
      procedimentoId: this.selectedProc.id,
      profissionalId: this.selectedProfissional.id,
      data
    }).subscribe({
      next: list => { this.slots = list; this.loadingSlots = false; },
      error: ()  => {
        this.loadingSlots = false;
        this.msg.add({ severity: 'error', summary: 'Erro', detail: 'Não foi possível carregar os horários disponíveis.' });
      }
    });
  }

  selectSlot(s: SlotDisponivel) { this.selectedSlot = s; }

  goToStep4() {
    if (!this.selectedSlot) return;
    this.step = 4;
  }

  // ─── Step 4: Confirmar ────────────────────────────────────────────────────

  submit() {
    if (!this.selectedProc || !this.selectedProfissional || !this.selectedSlot) return;
    this.loadingSubmit = true;

    const payload: AgendamentoRequest = {
      procedimentoId: this.selectedProc.id,
      profissionalId: this.selectedProfissional.id,
      inicio:         this.selectedSlot.inicio,
      fim:            this.selectedSlot.fim,
      observacao:     this.form.get('observacao')?.value || undefined
    };

    this.agendamentoSvc.criar(payload).subscribe({
      next: () => {
        this.msg.add({ severity: 'success', summary: 'Solicitado!', detail: 'Aguarde aprovação do salão.' });
        setTimeout(() => this.router.navigate(['/agenda/minha']), 1500);
      },
      error: (err) => {
        const detail = err?.error?.message ?? 'Não foi possível criar o agendamento.';
        this.msg.add({ severity: 'error', summary: 'Erro', detail });
        this.loadingSubmit = false;
      }
    });
  }

  // ─── Helpers ─────────────────────────────────────────────────────────────

  formatDate(date: Date): string {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, '0');
    const d = String(date.getDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;
  }

  formatSlotLabel(slot: SlotDisponivel): string {
    const toTime = (iso: string) =>
      new Date(iso).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
    return `${toTime(slot.inicio)} – ${toTime(slot.fim)}`;
  }
}
