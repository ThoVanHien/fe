import { Component, EventEmitter, Input, Output } from '@angular/core';
import { DayRow, TimeField } from '../../worktime.models';

@Component({
  selector: 'app-daily-work-table',
  templateUrl: './daily-work-table.component.html',
  styleUrl: './daily-work-table.component.scss',
})
export class DailyWorkTableComponent {
  @Input({ required: true }) weekRows: DayRow[] = [];
  @Input({ required: true }) rowErrors: Record<string, string> = {};

  @Output() timeTextInput = new EventEmitter<{
    date: string;
    field: TimeField;
    value: string;
  }>();
  @Output() timeTextBlur = new EventEmitter<{ date: string; field: TimeField }>();
  @Output() timeArrowAdjust = new EventEmitter<{
    date: string;
    field: TimeField;
    event: KeyboardEvent;
  }>();
  @Output() draftChange = new EventEmitter<string>();
  @Output() halfDayToggle = new EventEmitter<string>();
  @Output() oneDayToggle = new EventEmitter<string>();

  trackByDate(_: number, row: DayRow): string {
    return row.date;
  }

  isFriday(date: string): boolean {
    const [year, month, day] = date.split('-').map(Number);
    return new Date(year, month - 1, day).getDay() === 5;
  }

  toHoursMinutes(totalMinutes: number): string {
    const normalized = Math.max(0, Math.round(totalMinutes));
    const hours = Math.floor(normalized / 60);
    const minutes = normalized % 60;
    return `${hours}h ${minutes.toString().padStart(2, '0')}m`;
  }

  onTimeTextInput(date: string, field: TimeField, value: string): void {
    this.timeTextInput.emit({ date, field, value });
  }

  onTimeTextBlur(date: string, field: TimeField): void {
    this.timeTextBlur.emit({ date, field });
  }

  onTimeArrowAdjust(date: string, field: TimeField, event: KeyboardEvent): void {
    this.timeArrowAdjust.emit({ date, field, event });
  }
}
