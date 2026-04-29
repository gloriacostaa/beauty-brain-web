import {ApplicationConfig, LOCALE_ID, provideZoneChangeDetection} from '@angular/core';
import {provideRouter} from '@angular/router';
import {provideHttpClient, withInterceptors} from '@angular/common/http';
import {provideAnimationsAsync} from '@angular/platform-browser/animations/async';
import {providePrimeNG} from 'primeng/config';
import Aura from '@primeuix/themes/aura';
import {routes} from './app.routes';
import {jwtInterceptor} from './core/interceptors/jwt.interceptor';
import {ConfirmationService, MessageService} from 'primeng/api';
import {registerLocaleData} from '@angular/common';
import localePt from '@angular/common/locales/pt'; // ← sem sufixo

registerLocaleData(localePt, 'pt-BR'); // ← registra com alias 'pt-BR'

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideHttpClient(withInterceptors([jwtInterceptor])),
    provideAnimationsAsync(),
    {provide: LOCALE_ID, useValue: 'pt-BR'},
    providePrimeNG({
      theme: {
        preset: Aura
      },
      translation: {
        // Tradução manual direto aqui ↓
        dayNames: ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'],
        dayNamesShort: ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'],
        dayNamesMin: ['Do', 'Se', 'Te', 'Qa', 'Qi', 'Se', 'Sa'],
        monthNames: ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
          'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'],
        monthNamesShort: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun',
          'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'],
        today: 'Hoje',
        clear: 'Limpar',
        dateFormat: 'dd/mm/yy',
        weekHeader: 'Sem',
        firstDayOfWeek: 0,
      }
    }),
    MessageService,
    ConfirmationService,
  ]
};

