import {inject} from '@angular/core';
import {CanActivateFn, Router} from '@angular/router';
import {AuthService} from '../services/auth.service';

export const authGuard: CanActivateFn = () => {
  const auth   = inject(AuthService);
  const router = inject(Router);
  if (auth.isLogged()) return true;
  return router.createUrlTree(['/login']);
};

export const adminGuard: CanActivateFn = () => {
  const auth   = inject(AuthService);
  const router = inject(Router);
  if (auth.isAdmin()) return true;
  return router.createUrlTree(['/agenda/minha']);
};

export const profissionalOrAdminGuard: CanActivateFn = () => {
  const auth   = inject(AuthService);
  const router = inject(Router);
  if (auth.isAdmin() || auth.isProfissional()) return true;
  return router.createUrlTree(['/agenda/minha']);
};

export const guestGuard: CanActivateFn = () => {
  const auth   = inject(AuthService);
  const router = inject(Router);
  if (!auth.isLogged()) return true;
  const dest = auth.isAdmin()        ? '/agendamentos/aprovacoes'
             : auth.isProfissional() ? '/agenda/admin'
             : '/agenda/minha';
  return router.createUrlTree([dest]);
};
