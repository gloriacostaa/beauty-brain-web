import {Routes} from '@angular/router';
import {adminGuard, authGuard, guestGuard, profissionalOrAdminGuard} from './core/guards/guards';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },

  { path: 'login',    canActivate: [guestGuard],
    loadComponent: () => import('./features/auth/login/login.component').then(m => m.LoginComponent) },

  { path: 'register', canActivate: [guestGuard],
    loadComponent: () => import('./features/auth/register/register.component').then(m => m.RegisterComponent) },

  {
    path: 'catalogo',
    canActivate: [authGuard],
    loadComponent: () => import('./features/agendamento/agendar/agendar.component').then(m => m.AgendarComponent)
  },

  { path: 'sobre',
    loadComponent: () => import('./features/sobre/sobre.component').then(m => m.SobreComponent) },

  { path: 'agenda/minha', canActivate: [authGuard],
    loadComponent: () => import('./features/agenda/minha-agenda/minha-agenda.component').then(m => m.MinhaAgendaComponent) },

  // ADMIN + PROFISSIONAL
  { path: 'agendamentos/aprovacoes', canActivate: [authGuard, profissionalOrAdminGuard],
    loadComponent: () => import('./features/agendamento/aprovacoes/aprovacoes.component').then(m => m.AprovacoesComponent) },

  { path: 'agenda/admin', canActivate: [authGuard, profissionalOrAdminGuard],
    loadComponent: () => import('./features/agenda/agenda-admin/agenda-admin.component').then(m => m.AgendaAdminComponent) },

  // ADMIN only
  { path: 'admin/profissionais', canActivate: [authGuard, adminGuard],
    loadComponent: () => import('./features/admin/profissional-form/profissional-form.component').then(m => m.ProfissionalFormComponent) },

  { path: 'admin/servicos', canActivate: [authGuard, adminGuard],
    loadComponent: () => import('./features/admin/servico-form/servico-form.component').then(m => m.ServicoFormComponent) },

  { path: 'admin/usuarios', canActivate: [authGuard, adminGuard],
    loadComponent: () => import('./features/admin/usuarios-list/usuarios-list.component').then(m => m.UsuariosListComponent) },

  { path: '**', redirectTo: 'login' }
];
