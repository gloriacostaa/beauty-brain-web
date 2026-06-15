import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Usuario} from '../models/models';

const API = 'http://localhost:8080/api/usuarios';

@Injectable({providedIn: 'root'})
export class UsuarioService {
  constructor(private readonly http: HttpClient) {
  }

  listar() {
    return this.http.get<Usuario[]>(API);
  }

  listarUsuariosAtivos() {
    return this.http.get<Usuario[]>(`${API}/user`);
  }

  buscarPorId(id: number) {
    return this.http.get<Usuario>(`${API}/${id}`);
  }

  ativar(id: number) {
    return this.http.patch<void>(`${API}/${id}/ativar`, {});
  }

  desativar(id: number) {
    return this.http.patch<void>(`${API}/${id}/desativar`, {});
  }

  alterarRole(id: number, role: 'ADMIN' | 'USER') {
    return this.http.patch<void>(`${API}/${id}/role`, {role});
  }
}

