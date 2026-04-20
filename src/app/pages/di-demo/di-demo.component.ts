import { Component, inject } from '@angular/core';
import { DI_APP_CONFIG, DI_CLOCK, DI_LOGGER, DI_RUNTIME_NOTE, DI_SCOPE_LABEL, DiAppConfig, DiClock, LocalClockService, runtimeNoteFactory } from '../../core/di.tokens';
import { DiLoggerService } from '../../core/di-logger.service';
import { DiSessionService } from '../../core/di-session.service';

@Component({
  selector: 'app-di-demo',
  templateUrl: './di-demo.component.html',
  providers: [
    {
      provide: DI_APP_CONFIG,
      useValue: {
        feature: 'Dependency Injection lab',
        apiBase: '/api/learning',
        retryLimit: 3
      } satisfies DiAppConfig
    },
    {
      provide: DI_LOGGER,
      useExisting: DiLoggerService
    },
    {
      provide: DI_CLOCK,
      useClass: LocalClockService
    },
    {
      provide: DI_RUNTIME_NOTE,
      useFactory: runtimeNoteFactory
    },
    {
      provide: DI_SCOPE_LABEL,
      useValue: 'di-page'
    }
  ]
})
export class DiDemoComponent {
  private readonly rootLogger = inject(DiLoggerService);

  readonly session = inject(DiSessionService);
  readonly config = inject(DI_APP_CONFIG);
  readonly loggerAlias = inject(DI_LOGGER);
  readonly clock = inject(DI_CLOCK);
  readonly runtimeNote = inject(DI_RUNTIME_NOTE);

  readonly loggerUsesSameInstance = this.rootLogger === this.loggerAlias;
  readonly rootConcepts = [
    '`providedIn: root` tao singleton cho ca app',
    '`InjectionToken` dung de inject object, string va contract khong phai class',
    '`inject()` lay dependency ngay trong field initializer hay function'
  ];

  constructor() {
    this.loggerAlias.log('Mo trang DI demo');
  }

  refreshExamples(): void {
    this.session.incrementVisits();
    this.loggerAlias.log('Tang visit count trong DI lab');
  }

  currentTime(): string {
    return this.clock.getLabel();
  }
}
