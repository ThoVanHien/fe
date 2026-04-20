import { inject, InjectionToken } from '@angular/core';
import { DiLoggerService } from './di-logger.service';
import { DiSessionService } from './di-session.service';

export interface DiAppConfig {
  readonly feature: string;
  readonly apiBase: string;
  readonly retryLimit: number;
}

export interface DiClock {
  getLabel(): string;
}

export class LocalClockService implements DiClock {
  getLabel(): string {
    return new Date().toLocaleTimeString('vi-VN');
  }
}

export const DI_APP_CONFIG = new InjectionToken<DiAppConfig>('DI_APP_CONFIG');
export const DI_LOGGER = new InjectionToken<DiLoggerService>('DI_LOGGER');
export const DI_CLOCK = new InjectionToken<DiClock>('DI_CLOCK');
export const DI_RUNTIME_NOTE = new InjectionToken<string>('DI_RUNTIME_NOTE');
export const DI_SCOPE_LABEL = new InjectionToken<string>('DI_SCOPE_LABEL');

export function runtimeNoteFactory(): string {
  const config = inject(DI_APP_CONFIG);
  const session = inject(DiSessionService);
  const clock = inject(DI_CLOCK);

  return `${config.feature} dang chay voi session ${session.instanceId} luc ${clock.getLabel()}`;
}
