import { Component, Inject, Optional, Self, SkipSelf } from '@angular/core';
import { DI_SCOPE_LABEL } from '../../core/di.tokens';
import { PanelStateService } from '../../core/panel-state.service';

@Component({
  selector: 'app-di-scope-probe',
  templateUrl: './di-scope-probe.component.html'
})
export class DiScopeProbeComponent {
  constructor(
    @Optional() @Self() @Inject(DI_SCOPE_LABEL) readonly selfScope: string | null,
    @Optional() @SkipSelf() @Inject(DI_SCOPE_LABEL) readonly parentScope: string | null,
    @Optional() readonly panelState: PanelStateService | null
  ) {}
}
