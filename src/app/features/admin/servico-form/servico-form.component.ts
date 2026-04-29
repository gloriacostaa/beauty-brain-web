import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { ProcedimentoService } from '../../../core/services/procedimento.service';
import { Procedimento } from '../../../core/models/models';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { InputNumberModule } from 'primeng/inputnumber';
import { TextareaModule } from 'primeng/textarea';
import { TableModule } from 'primeng/table';
import { DialogModule } from 'primeng/dialog';
import { TagModule } from 'primeng/tag';
import { SkeletonModule } from 'primeng/skeleton';
@Component({
  selector: 'app-servico-form',
  standalone: true,
  imports: [
    CommonModule, ReactiveFormsModule,
    ButtonModule, InputTextModule, InputNumberModule, TextareaModule,
    TableModule, DialogModule, TagModule, SkeletonModule
  ],
  templateUrl: './servico-form.component.html',
  styleUrl: './servico-form.component.scss'
})
export class ServicoFormComponent implements OnInit {
  private fb  = inject(FormBuilder);
  private svc = inject(ProcedimentoService);
  private msg = inject(MessageService);
  procedimentos: Procedimento[] = [];
  loading        = true;
  dialogVisible  = false;
  editando: Procedimento | null = null;
  saving         = false;
  form = this.fb.group({
    nome:           ['', [Validators.required, Validators.minLength(2)]],
    descricao:      ['', Validators.required],
    fotoUrl:        [''],
    duracaoMinutos: [30, [Validators.required, Validators.min(5)]],
    preco:          [0,  [Validators.required, Validators.min(0)]]
  });
  ngOnInit() { this.carregar(); }
  carregar() {
    this.loading = true;
    this.svc.listar().subscribe({
      next: data => { this.procedimentos = data; this.loading = false; },
      error: ()  => { this.loading = false; }
    });
  }
  abrirNovo() {
    this.editando = null;
    this.form.reset({ duracaoMinutos: 30, preco: 0 });
    this.dialogVisible = true;
  }
  abrirEdicao(p: Procedimento) {
    this.editando = p;
    this.form.patchValue({
      nome: p.nome, descricao: p.descricao,
      fotoUrl: p.fotoUrl, duracaoMinutos: p.duracaoMinutos, preco: p.preco
    });
    this.dialogVisible = true;
  }
  salvar() {
    if (this.form.invalid) return;
    this.saving = true;
    const val   = this.form.getRawValue() as any;
    const req$ = this.editando
      ? this.svc.atualizar(this.editando.id, val)
      : this.svc.criar(val);
    req$.subscribe({
      next: () => {
        this.msg.add({ severity: 'success', summary: 'Salvo!', detail: 'Serviço salvo com sucesso.' });
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
  desativar(p: Procedimento) {
    this.svc.desativar(p.id).subscribe({
      next: () => {
        this.msg.add({ severity: 'warn', summary: 'Desativado', detail: `"${p.nome}" foi desativado.` });
        this.carregar();
      },
      error: () => this.msg.add({ severity: 'error', summary: 'Erro', detail: 'Não foi possível desativar.' })
    });
  }
}
