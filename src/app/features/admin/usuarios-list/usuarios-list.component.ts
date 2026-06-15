import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MessageService, ConfirmationService } from 'primeng/api';
import { UsuarioService } from '../../../core/services/usuario.service';
import { Usuario } from '../../../core/models/models';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { SkeletonModule } from 'primeng/skeleton';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { TooltipModule } from 'primeng/tooltip';
import { InputTextModule } from 'primeng/inputtext';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-usuarios-list',
  standalone: true,
  imports: [
    CommonModule, FormsModule,
    ButtonModule, TableModule, TagModule, SkeletonModule,
    ConfirmDialogModule, TooltipModule, InputTextModule
  ],
  templateUrl: './usuarios-list.component.html',
  styleUrl: './usuarios-list.component.scss'
})
export class UsuariosListComponent implements OnInit {
  private readonly usuarioSvc = inject(UsuarioService);
  private readonly msg        = inject(MessageService);
  private readonly confirm    = inject(ConfirmationService);

  usuarios: Usuario[] = [];
  loading             = true;
  filtro              = '';

  ngOnInit() {
    this.carregar();
  }

  carregar() {
    this.loading = true;
    this.usuarioSvc.listarUsuariosAtivos().subscribe({
      next: (data) => { this.usuarios = data; this.loading = false; },
      error: ()    => {
        this.msg.add({ severity: 'error', summary: 'Erro', detail: 'Nao foi possivel carregar os usuarios.' });
        this.loading = false;
      }
    });
  }

  get usuariosFiltrados(): Usuario[] {
    const q = this.filtro.trim().toLowerCase();
    if (!q) return this.usuarios;
    return this.usuarios.filter(u =>
      u.nome.toLowerCase().includes(q) ||
      u.email.toLowerCase().includes(q)
    );
  }

  confirmarToggleAtivo(u: Usuario) {
    const acao = u.ativo ? 'desativar' : 'ativar';
    this.confirm.confirm({
      message: `Deseja ${acao} o usuario ${u.nome}?`,
      header: `Confirmar ${acao}`,
      icon: u.ativo ? 'pi pi-ban' : 'pi pi-check-circle',
      acceptLabel: 'Sim',
      rejectLabel: 'Nao',
      accept: () => this.toggleAtivo(u)
    });
  }

  private toggleAtivo(u: Usuario) {
    const req$ = u.ativo
      ? this.usuarioSvc.desativar(u.id)
      : this.usuarioSvc.ativar(u.id);

    req$.subscribe({
      next: () => {
        this.msg.add({
          severity: u.ativo ? 'warn' : 'success',
          summary: u.ativo ? 'Desativado' : 'Ativado',
          detail: `Usuario ${u.nome} ${u.ativo ? 'desativado' : 'ativado'} com sucesso.`
        });
        this.carregar();
      },
      error: () => this.msg.add({ severity: 'error', summary: 'Erro', detail: 'Operacao nao realizada.' })
    });
  }

  roleSeverity(role: string): 'info' | 'warn' | 'secondary' {
    if (role === 'ADMIN') return 'warn';
    if (role === 'PROFISSIONAL') return 'info';
    return 'secondary';
  }

  roleLabel(role: string): string {
    if (role === 'ADMIN') return 'Admin';
    if (role === 'PROFISSIONAL') return 'Profissional';
    return 'Cliente';
  }
}

