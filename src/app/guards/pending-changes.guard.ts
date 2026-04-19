import { CanDeactivateFn } from '@angular/router';
import { Observable } from 'rxjs';

export interface CanLeavePage {
  canDeactivate: () => boolean | Promise<boolean> | Observable<boolean>;
}

export const pendingChangesGuard: CanDeactivateFn<CanLeavePage> = (component) => component.canDeactivate();
