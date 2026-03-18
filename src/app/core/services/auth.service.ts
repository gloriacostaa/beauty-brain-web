import { Injectable, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { tap } from 'rxjs/operators';
import { AuthResponse, LoginRequest, RegisterRequest, Role } from '../models/models';

const API = 'http://localhost:8080/api';
const TOKEN_KEY = 'bb_token';
const USER_KEY  = 'bb_user';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private _user = signal<AuthResponse | null>(this.loadUser());

  readonly user     = this._user.asReadonly();
  readonly isLogged = computed(() => !!this._user());
  readonly isAdmin  = computed(() => this._user()?.role === 'ADMIN');
  readonly userName = computed(() => this._user()?.nome ?? '');

  constructor(private http: HttpClient, private router: Router) {}

  login(body: LoginRequest) {
    return this.http.post<AuthResponse>(`${API}/auth/login`, body).pipe(
      tap(res => this.saveSession(res))
    );
  }

  register(body: RegisterRequest) {
    return this.http.post<AuthResponse>(`${API}/auth/register`, body).pipe(
      tap(res => this.saveSession(res))
    );
  }

  logout() {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    this._user.set(null);
    this.router.navigate(['/login']);
  }

  getToken(): string | null {
    return localStorage.getItem(TOKEN_KEY);
  }

  private saveSession(res: AuthResponse) {
    localStorage.setItem(TOKEN_KEY, res.token);
    localStorage.setItem(USER_KEY, JSON.stringify(res));
    this._user.set(res);
  }

  private loadUser(): AuthResponse | null {
    try {
      const raw = localStorage.getItem(USER_KEY);
      return raw ? JSON.parse(raw) : null;
    } catch { return null; }
  }
}
