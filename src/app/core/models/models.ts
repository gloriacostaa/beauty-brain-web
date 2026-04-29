export type Role = 'ADMIN' | 'USER';
export type StatusAgendamento = 'PENDENTE' | 'APROVADO' | 'RECUSADO' | 'CANCELADO';
export type DiaSemana = 0 | 1 | 2 | 3 | 4 | 5 | 6;

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

export interface Profissional {
  id: number;
  usuarioId: number;
  nome: string;
  bio?: string;
  fotoUrl?: string;
  ativo: boolean;
}

export interface ProfissionalProcedimento {
  profissionalId: number;
  procedimentoId: number;
  duracaoMinutos?: number;
}

export interface Disponibilidade {
  id: number;
  profissionalId: number;
  diaSemana: DiaSemana;
  horaInicio: string; // HH:mm:ss
  horaFim: string;    // HH:mm:ss
  ativo: boolean;
}

/** DTO de entrada para salvar disponibilidade de um dia */
export interface DisponibilidadeRequest {
  diaSemana: DiaSemana;
  horaInicio: string; // HH:mm
  horaFim: string;    // HH:mm
}

export interface SlotDisponivel {
  inicio: string;
  fim: string;
}

export interface Agendamento {
  id: number;
  usuarioId: number;
  usuarioNome: string;
  procedimentoId: number;
  procedimentoNome: string;
  profissionalId: number;
  profissionalNome: string;
  inicio: string;   // OffsetDateTime ISO-8601
  fim: string;      // OffsetDateTime ISO-8601
  status: StatusAgendamento;
  observacao?: string;
  motivoRecusa?: string;
  criadoEm: string; // OffsetDateTime ISO-8601
}

export interface AgendamentoRequest {
  procedimentoId: number;
  profissionalId: number;
  inicio: string; // OffsetDateTime ISO-8601
  fim: string;    // OffsetDateTime ISO-8601
  observacao?: string;
}


export interface DisponibilidadeQuery {
  procedimentoId: number;
  profissionalId: number;
  data: string; // yyyy-MM-dd
}

export interface RecusaRequest {
  motivoRecusa: string;
}
