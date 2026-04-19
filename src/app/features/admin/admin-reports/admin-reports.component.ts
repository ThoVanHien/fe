import { Component } from '@angular/core';

interface ReportRow {
  label: string;
  value: string;
}

@Component({
  selector: 'app-admin-reports',
  templateUrl: './admin-reports.component.html'
})
export class AdminReportsComponent {
  readonly rows: ReportRow[] = [
    { label: 'Route chính', value: '/admin' },
    { label: 'Route con', value: '/admin/reports' },
    { label: 'Guard', value: 'canMatch' },
    { label: 'Module router', value: 'forChild' }
  ];
}
