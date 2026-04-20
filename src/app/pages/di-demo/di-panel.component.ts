import { Component, Input, inject } from '@angular/core';
import { DI_SCOPE_LABEL } from '../../core/di.tokens';
import { DiSessionService } from '../../core/di-session.service';
import { PanelStateService } from '../../core/panel-state.service';

@Component({
  selector: 'app-di-panel',
  templateUrl: './di-panel.component.html',
  providers: [
    PanelStateService,
    {
      provide: DI_SCOPE_LABEL,
      useValue: 'di-panel'
    }
  ]
})
export class DiPanelComponent {
  @Input({ required: true }) title = '';

  readonly session = inject(DiSessionService);
  readonly panelState = inject(PanelStateService);

  bumpLocalCounter(): void {
    this.panelState.increment();
  }
}
