import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { inject } from '@angular/core';
import { MessageService } from 'primeng/api';
import { AgendamentoService } from '../../../core/services/agendamento.service';
import { ProcedimentoService } from '../../../core/services/procedimento.service';
import { Procedimento } from '../../../core/models/models';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { DatePickerModule } from 'primeng/datepicker';
import { TextareaModule } from 'primeng/textarea';
import { TagModule } from 'primeng/tag';
import { RippleModule } from 'primeng/ripple';

@Component({
  selector: 'app-solicitar',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule,
    CardModule, ButtonModule, DatePickerModule,
    TextareaModule, TagModule, RippleModule],
  templateUrl: './solicitar.component.html',
  styleUrl: './solicitar.component.scss'
})
export class SolicitarComponent implements OnInit {
  private fb              = inject(FormBuilder);
  private agendamentoSvc  = inject(AgendamentoService);
  private procedimentoSvc = inject(ProcedimentoService);
  private router          = inject(Router);
  private msg             = inject(MessageService);

  step = 1;
  procedimentos: Procedimento[] = [];
  selected: Procedimento | null = null;
  loading = false;
  minDate = new Date();

  form = this.fb.group({
    dataHora:   [null as Date | null, Validators.required],
    observacao: ['']
  });

  ngOnInit() {
    this.procedimentoSvc.listar().subscribe(list => this.procedimentos = list);
  }

  selectProc(p: Procedimento) { this.selected = p; }

  submit() {
    const dataHoraVal = this.form.get('dataHora')?.value;
    if (!this.selected || !dataHoraVal) return;

    this.loading = true;
    const dataHora = (dataHoraVal as Date).toISOString();

    this.agendamentoSvc.criar({
      procedimentoId: this.selected.id,
      dataHora,
      observacao: this.form.get('observacao')?.value || undefined
    }).subscribe({
      next: () => {
        this.msg.add({ severity: 'success', summary: 'Solicitado!', detail: 'Aguarde aprovação do salão.' });
        setTimeout(() => this.router.navigate(['/agenda/minha']), 1500);
      },
      error: () => {
        this.msg.add({ severity: 'error', summary: 'Erro', detail: 'Não foi possível criar o agendamento.' });
        this.loading = false;
      }
    });
  }
}

