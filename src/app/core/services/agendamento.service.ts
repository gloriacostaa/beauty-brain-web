import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Agendamento, AgendamentoRequest, RecusaRequest } from '../models/models';

const API = 'http://localhost:8080/api/agendamentos';

@Injectable({ providedIn: 'root' })
export class AgendamentoService {
  constructor(private http: HttpClient) {}

  listarTodos()     { return this.http.get<Agendamento[]>(API); }
  listarMeus()      { return this.http.get<Agendamento[]>(`${API}/meus`); }
  listarPendentes() { return this.http.get<Agendamento[]>(`${API}/pendentes`); }

  criar(body: AgendamentoRequest) {
    return this.http.post<Agendamento>(API, body);
  }
  aprovar(id: number) {
    return this.http.patch<Agendamento>(`${API}/${id}/aprovar`, {});
  }
  recusar(id: number, body: RecusaRequest) {
    return this.http.patch<Agendamento>(`${API}/${id}/recusar`, body);
  }
  cancelar(id: number) {
    return this.http.patch<Agendamento>(`${API}/${id}/cancelar`, {});
  }
}
