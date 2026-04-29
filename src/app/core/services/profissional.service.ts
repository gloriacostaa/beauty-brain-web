import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Disponibilidade, DisponibilidadeQuery, DisponibilidadeRequest, Profissional, SlotDisponivel } from '../models/models';

const API = 'http://localhost:8080/api/profissionais';

export interface ProfissionalCreateRequest {
  nome: string;
  email: string;
  senha: string;
  bio?: string;
  fotoUrl?: string;
  procedimentoIds?: number[];
  disponibilidades?: DisponibilidadeRequest[];
}

export interface ProfissionalUpdateRequest {
  bio?: string;
  fotoUrl?: string;
  procedimentoIds?: number[];
  disponibilidades?: DisponibilidadeRequest[];
}

@Injectable({ providedIn: 'root' })
export class ProfissionalService {
  constructor(private readonly http: HttpClient) {}

  listar() {
    return this.http.get<Profissional[]>(API);
  }

  listarPorProcedimento(procedimentoId: number) {
    return this.http.get<Profissional[]>(`${API}/por-procedimento/${procedimentoId}`);
  }

  listarProcedimentosDoProfissional(profissionalId: number) {
    return this.http.get<number[]>(`${API}/${profissionalId}/procedimentos`);
  }

  listarDisponibilidades(profissionalId: number) {
    return this.http.get<Disponibilidade[]>(`${API}/${profissionalId}/disponibilidades`);
  }

  listarSlotsDisponiveis(query: DisponibilidadeQuery) {
    const params = new HttpParams()
      .set('procedimentoId', query.procedimentoId)
      .set('profissionalId', query.profissionalId)
      .set('data', query.data);
    return this.http.get<SlotDisponivel[]>(`${API}/slots`, { params });
  }

  criar(body: ProfissionalCreateRequest) {
    return this.http.post<Profissional>(API, body);
  }

  atualizar(id: number, body: ProfissionalUpdateRequest) {
    return this.http.put<Profissional>(`${API}/${id}`, body);
  }

  desativar(id: number) {
    return this.http.delete<void>(`${API}/${id}`);
  }

}
