import { Component, Input } from '@angular/core';
import { WeeklySummary } from '../../worktime.models';

@Component({
  selector: 'app-weekly-stats',
  templateUrl: './weekly-stats.component.html',
  styleUrl: './weekly-stats.component.scss',
})
export class WeeklyStatsComponent {
  @Input({ required: true }) summary!: WeeklySummary;
  @Input({ required: true }) standardWeekMinutes = 0;
  @Input({ required: true }) maxWeekMinutes = 0;
  @Input({ required: true }) fridayCheckoutSuggestion = '';
  @Input() maxPolicyOtMinutes = 16 * 60;

  toHoursMinutes(totalMinutes: number): string {
    const normalized = Math.max(0, Math.round(totalMinutes));
    const hours = Math.floor(normalized / 60);
    const minutes = normalized % 60;
    return `${hours}h ${minutes.toString().padStart(2, '0')}m`;
  }
}
