import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Procedimento, ProcedimentoRequest } from '../models/models';

const API = 'http://localhost:8080/api/procedimentos';

@Injectable({ providedIn: 'root' })
export class ProcedimentoService {
  constructor(private http: HttpClient) {}

  listar()          { return this.http.get<Procedimento[]>(API); }
  buscarPorId(id: number) { return this.http.get<Procedimento>(`${API}/${id}`); }

  criar(body: ProcedimentoRequest)          { return this.http.post<Procedimento>(API, body); }
  atualizar(id: number, body: ProcedimentoRequest) { return this.http.put<Procedimento>(`${API}/${id}`, body); }
  desativar(id: number)                     { return this.http.delete<void>(`${API}/${id}`); }
}

