export type Role = 'ADMIN' | 'USER';
export type StatusAgendamento = 'PENDENTE' | 'APROVADO' | 'RECUSADO' | 'CANCELADO';

export interface Usuario {
  id: number;
  nome: string;
  email: string;
  telefone?: string;
  role: Role;
  ativo: boolean;
  criadoEm: string;
}

export interface AuthResponse {
  token: string;
  nome: string;
  email: string;
  role: Role;
}

export interface LoginRequest {
  email: string;
  senha: string;
}

export interface RegisterRequest {
  nome: string;
  email: string;
  senha: string;
  telefone?: string;
}

export interface Procedimento {
  id: number;
  nome: string;
  descricao: string;
  fotoUrl: string;
  duracaoMinutos: number;
  preco: number;
  ativo: boolean;
}

export interface ProcedimentoRequest {
  nome: string;
  descricao: string;
  fotoUrl: string;
  duracaoMinutos: number;
  preco: number;
}

export interface Agendamento {
  id: number;
  usuarioId: number;
  usuarioNome: string;
  procedimentoId: number;
  procedimentoNome: string;
  dataHora: string;
  status: StatusAgendamento;
  observacao?: string;
  motivoRecusa?: string;
  criadoEm: string;
}

export interface AgendamentoRequest {
  procedimentoId: number;
  dataHora: string;
  observacao?: string;
}

export interface RecusaRequest {
  motivoRecusa: string;
}

