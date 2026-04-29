import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { ProcedimentoService } from '../../../core/services/procedimento.service';
import { ProfissionalService, ProfissionalCreateRequest, ProfissionalUpdateRequest } from '../../../core/services/profissional.service';
import { Procedimento, Profissional, DiaSemana } from '../../../core/models/models';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { TextareaModule } from 'primeng/textarea';
import { TableModule } from 'primeng/table';
import { DialogModule } from 'primeng/dialog';
import { TagModule } from 'primeng/tag';
import { SkeletonModule } from 'primeng/skeleton';
import { MultiSelectModule } from 'primeng/multiselect';
import { TabViewModule } from 'primeng/tabview';
import { ToggleButtonModule } from 'primeng/togglebutton';

export interface DiaDisponibilidade {
  diaSemana: DiaSemana;
  label: string;
  ativo: boolean;
  horaInicio: string;
  horaFim: string;
}

const DIAS_DEFAULT: DiaDisponibilidade[] = [
  { diaSemana: 0, label: 'Domingo',       ativo: false, horaInicio: '08:00', horaFim: '18:00' },
  { diaSemana: 1, label: 'Segunda-feira', ativo: false, horaInicio: '08:00', horaFim: '18:00' },
  { diaSemana: 2, label: 'Terça-feira',   ativo: false, horaInicio: '08:00', horaFim: '18:00' },
  { diaSemana: 3, label: 'Quarta-feira',  ativo: false, horaInicio: '08:00', horaFim: '18:00' },
  { diaSemana: 4, label: 'Quinta-feira',  ativo: false, horaInicio: '08:00', horaFim: '18:00' },
  { diaSemana: 5, label: 'Sexta-feira',   ativo: true,  horaInicio: '08:00', horaFim: '18:00' },
  { diaSemana: 6, label: 'Sábado',        ativo: true,  horaInicio: '08:00', horaFim: '14:00' },
];

@Component({
  selector: 'app-profissional-form',
  standalone: true,
  imports: [
    CommonModule, ReactiveFormsModule, FormsModule,
    ButtonModule, InputTextModule, TextareaModule,
    TableModule, DialogModule, TagModule, SkeletonModule,
    MultiSelectModule, TabViewModule, ToggleButtonModule
  ],
  templateUrl: './profissional-form.component.html',
  styleUrl: './profissional-form.component.scss'
})
export class ProfissionalFormComponent implements OnInit {
  private readonly fb       = inject(FormBuilder);
  private readonly profSvc  = inject(ProfissionalService);
  private readonly procSvc  = inject(ProcedimentoService);
  private readonly msg      = inject(MessageService);

  profissionais: Profissional[] = [];
  procedimentos: Procedimento[] = [];
  loading                       = true;
  dialogVisible                 = false;
  editando: Profissional | null = null;
  saving                        = false;

  procsVinculados: number[]     = [];
  dias: DiaDisponibilidade[]    = [];

  form = this.fb.group({
    nome:    ['', [Validators.required, Validators.minLength(3)]],
    email:   ['', [Validators.required, Validators.email]],
    senha:   ['', Validators.minLength(6)],
    bio:     [''],
    fotoUrl: ['']
  });

  ngOnInit() {
    this.carregar();
    this.procSvc.listar().subscribe((list: Procedimento[]) => this.procedimentos = list);
  }

  carregar() {
    this.loading = true;
    this.profSvc.listar().subscribe({
      next: (data: Profissional[]) => { this.profissionais = data; this.loading = false; },
      error: ()                    => { this.loading = false; }
    });
  }

  private resetDias() {
    this.dias = DIAS_DEFAULT.map(d => ({ ...d }));
  }

  abrirNovo() {
    this.editando        = null;
    this.procsVinculados = [];
    this.resetDias();
    this.form.reset();

    // Restaurar todos os validators para o cadastro
    this.form.get('nome')?.setValidators([Validators.required, Validators.minLength(3)]);
    this.form.get('nome')?.updateValueAndValidity();
    this.form.get('email')?.setValidators([Validators.required, Validators.email]);
    this.form.get('email')?.updateValueAndValidity();
    this.form.get('senha')?.setValidators([Validators.required, Validators.minLength(6)]);
    this.form.get('senha')?.updateValueAndValidity();

    this.dialogVisible = true;
  }

  abrirEdicao(p: Profissional) {
    this.editando        = p;
    this.procsVinculados = [];
    this.resetDias();

    // No modo edição: nome e email não são editáveis — remover validators obrigatórios
    ['nome', 'email', 'senha'].forEach(campo => {
      this.form.get(campo)?.clearValidators();
      this.form.get(campo)?.updateValueAndValidity();
    });

    this.form.patchValue({ nome: p.nome ?? '', bio: p.bio ?? '', fotoUrl: p.fotoUrl ?? '', email: '', senha: '' });
    this.form.markAsPristine();
    this.form.markAsUntouched();

    this.dialogVisible = true;

    // carrega procedimentos vinculados
    this.profSvc.listarProcedimentosDoProfissional(p.id)
      .subscribe((ids: number[]) => this.procsVinculados = ids);

    // carrega disponibilidades existentes
    this.profSvc.listarDisponibilidades(p.id).subscribe(disps => {
      this.resetDias();
      disps.forEach(d => {
        const dia = this.dias.find(x => x.diaSemana === d.diaSemana);
        if (dia) {
          dia.ativo      = d.ativo;
          dia.horaInicio = d.horaInicio.substring(0, 5); // HH:mm:ss -> HH:mm
          dia.horaFim    = d.horaFim.substring(0, 5);
        }
      });
    });
  }

  /** Valida que todos os dias ativos têm horários coerentes */
  private disponibilidadesValidas(): boolean {
    return this.dias
      .filter(d => d.ativo)
      .every(d => d.horaInicio && d.horaFim && d.horaInicio < d.horaFim);
  }

  salvar() {
    // Só valida campos obrigatórios no cadastro novo
    if (!this.editando && this.form.invalid) {
      this.form.markAllAsTouched();
      this.msg.add({ severity: 'warn', summary: 'Atenção', detail: 'Preencha todos os campos obrigatórios.' });
      return;
    }
    if (!this.disponibilidadesValidas()) {
      this.msg.add({ severity: 'warn', summary: 'Atenção', detail: 'Verifique os horários dos dias ativos.' });
      return;
    }
    this.saving = true;
    const val   = this.form.getRawValue();

    const disponibilidades = this.dias
      .filter(d => d.ativo)
      .map(d => ({ diaSemana: d.diaSemana, horaInicio: d.horaInicio, horaFim: d.horaFim }));

    const req$ = this.editando
      ? this.profSvc.atualizar(this.editando.id, {
          bio: val.bio ?? undefined,
          fotoUrl: val.fotoUrl ?? undefined,
          procedimentoIds: this.procsVinculados,
          disponibilidades
        } as ProfissionalUpdateRequest)
      : this.profSvc.criar({
          nome:   val.nome!,
          email:  val.email!,
          senha:  val.senha!,
          bio:    val.bio ?? undefined,
          fotoUrl: val.fotoUrl ?? undefined,
          procedimentoIds: this.procsVinculados,
          disponibilidades
        } as ProfissionalCreateRequest);

    req$.subscribe({
      next: () => {
        this.msg.add({ severity: 'success', summary: 'Salvo!', detail: 'Profissional salvo com sucesso.' });
        this.dialogVisible = false;
        this.saving        = false;
        this.carregar();
      },
      error: (err: any) => {
        this.msg.add({ severity: 'error', summary: 'Erro', detail: err?.error?.message ?? 'Não foi possível salvar.' });
        this.saving = false;
      }
    });
  }

  desativar(p: Profissional) {
    this.profSvc.desativar(p.id).subscribe({
      next: () => {
        this.msg.add({ severity: 'warn', summary: 'Desativado', detail: `${p.nome} foi desativado.` });
        this.carregar();
      },
      error: () => this.msg.add({ severity: 'error', summary: 'Erro', detail: 'Não foi possível desativar.' })
    });
  }
}
