export class PanelStateService {
  readonly instanceId = Math.random().toString(36).slice(2, 8);

  localCount = 0;

  increment(): void {
    this.localCount += 1;
  }
}
