import { Directive, Input, OnChanges, TemplateRef, ViewContainerRef } from '@angular/core';

import { BlogRole } from '../../core/models';

@Directive({
  selector: '[appHasRole]'
})
export class HasRoleDirective implements OnChanges {
  @Input() appHasRole: BlogRole | BlogRole[] = [];

  private readonly currentRole: BlogRole = 'Admin';

  constructor(
    private readonly templateRef: TemplateRef<unknown>,
    private readonly viewContainerRef: ViewContainerRef
  ) {}

  ngOnChanges(): void {
    const allowedRoles = Array.isArray(this.appHasRole) ? this.appHasRole : [this.appHasRole];

    this.viewContainerRef.clear();

    if (allowedRoles.includes(this.currentRole)) {
      this.viewContainerRef.createEmbeddedView(this.templateRef);
    }
  }
}

