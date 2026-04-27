import { Component } from '@angular/core';
import {
  AttendanceRecord,
  DayRow,
  DayStatus,
  WeekDraftItem,
  WeeklySummary,
} from './worktime.models';

const POLICY = {
  earliestCheckIn: 6 * 60,
  lunchStart: 11 * 60,
  lunchEnd: 12 * 60,
  standardPresence: 9 * 60 + 48,
  standardWork: 8 * 60 + 48,
  halfDayWork: 4 * 60 + 24,
  oneDayWork: 8 * 60 + 48,
  maxPresenceNoOT: 11 * 60,
  violationPresence: 11 * 60 + 15,
  maxPresenceWithOT: 13 * 60,
  maxActualNoOT: 10 * 60,
  maxActualWithOT: 12 * 60,
  standardWeek: 44 * 60,
  maxWeek: 60 * 60,
  maxCountedMonThuForFriday: 10 * 60,
};

const STORAGE_KEY = 'work-time-records-v1';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  readonly policy = POLICY;
  private noOtReminderTimeoutId: number | null = null;
  private noOtReminderKey = '';
  private attemptedNotificationPermission = false;

  fromDate = '';
  toDate = '';
  fromDateModel: Date | null = null;
  toDateModel: Date | null = null;
  formError = '';

  records: AttendanceRecord[] = this.loadRecords();
  weekDraft: Record<string, WeekDraftItem> = {};
  rowErrors: Record<string, string> = {};
  weekRows: DayRow[] = [];
  weeklySummary: WeeklySummary = {
    totalActualMinutes: 0,
    weeklyOtMinutes: 0,
    requiredFridayWorkMinutes: POLICY.standardWeek,
    weeklyViolation: false,
  };

  constructor() {
    const currentWeek = this.getCurrentWeekRange(new Date());
    this.fromDate = currentWeek.fromDate;
    this.toDate = currentWeek.toDate;
    this.fromDateModel = this.parseDate(this.fromDate);
    this.toDateModel = this.parseDate(this.toDate);

    this.syncWeekDraft();
    this.refreshViewModel();
  }

  onDatePickerChange(field: 'from' | 'to', value: Date | null): void {
    if (!value || Number.isNaN(value.getTime())) {
      return;
    }

    if (field === 'from') {
      this.fromDateModel = value;
      this.fromDate = this.toISODate(value);
    } else {
      this.toDateModel = value;
      this.toDate = this.toISODate(value);
    }

    this.onDateRangeChange();
  }

  onDateRangeChange(): void {
    if (!this.fromDate || !this.toDate) {
      return;
    }

    if (this.parseDate(this.fromDate) > this.parseDate(this.toDate)) {
      this.formError = 'From Date không được lớn hơn To Date.';
      return;
    }

    this.fromDateModel = this.parseDate(this.fromDate);
    this.toDateModel = this.parseDate(this.toDate);
    this.formError = '';
    this.rowErrors = {};
    this.syncWeekDraft();
    this.refreshViewModel();
  }

  hasManualDataInRange(): boolean {
    const dateSet = new Set(this.getRangeDates());
    return this.records.some(
      (record) => dateSet.has(record.date) && this.isManualRecord(record),
    );
  }

  resetManualDataInRange(): void {
    const dateSet = new Set(this.getRangeDates());
    const hasManualData = this.records.some(
      (record) => dateSet.has(record.date) && this.isManualRecord(record),
    );

    if (!hasManualData) {
      return;
    }

    const shouldReset = window.confirm(
      'Reset sẽ xoá dữ liệu nhập tay trong khoảng ngày đang chọn. Dữ liệu nguồn API sẽ được giữ lại. Tiếp tục?',
    );
    if (!shouldReset) {
      return;
    }

    this.records = this.records.filter(
      (record) => !dateSet.has(record.date) || !this.isManualRecord(record),
    );
    this.persistRecords();

    this.formError = '';
    this.rowErrors = {};
    this.syncWeekDraft();
    this.refreshViewModel();
  }

  onDraftChange(date: string): void {
    this.rowErrors[date] = '';
    this.formError = '';

    const validation = this.validateDraft(date, this.getDraft(date));
    if (!validation.ok) {
      this.rowErrors[date] = validation.message;
      this.refreshViewModel();
      return;
    }

    if (validation.empty) {
      this.removeRecordByDate(date);
      this.persistRecords();
      this.refreshViewModel();
      return;
    }

    this.upsertRecord(validation.record);
    this.persistRecords();
    this.refreshViewModel();
  }

  onTimeTextInput(
    date: string,
    field: 'checkIn' | 'checkOut' | 'excludeTime',
    rawValue: string,
  ): void {
    const draft = this.getDraft(date);
    const normalized = this.normalizeTimeForTyping(rawValue);
    draft[field] = normalized;

    if (!normalized) {
      this.onDraftChange(date);
      return;
    }

    this.rowErrors[date] = '';
    this.refreshViewModel();
  }

  onTimeTextBlur(
    date: string,
    field: 'checkIn' | 'checkOut' | 'excludeTime',
  ): void {
    const draft = this.getDraft(date);
    const parsed = this.parseNaturalTime(draft[field], true);

    if (!parsed) {
      if (draft[field].trim()) {
        this.rowErrors[date] = 'Giờ không hợp lệ. Ví dụ: 1810, 8h10, 08:10.';
      }
      this.refreshViewModel();
      return;
    }

    draft[field] = parsed;
    this.onDraftChange(date);
  }

  onTimeArrowAdjust(
    date: string,
    field: 'checkIn' | 'checkOut' | 'excludeTime',
    event: KeyboardEvent,
  ): void {
    if (event.key !== 'ArrowUp' && event.key !== 'ArrowDown') {
      return;
    }

    event.preventDefault();

    const input = event.target as HTMLInputElement | null;
    const caret = input?.selectionStart ?? 0;
    const adjustHour = caret <= 2;
    const step = event.key === 'ArrowUp' ? 1 : -1;

    const draft = this.getDraft(date);
    const parsed = this.parseNaturalTime(draft[field], true);
    const base = parsed || '00:00';
    const [hhText, mmText] = base.split(':');
    let hh = Number(hhText);
    let mm = Number(mmText);

    if (adjustHour) {
      hh = (((hh + step) % 24) + 24) % 24;
    } else {
      const total = (((hh * 60 + mm + step) % (24 * 60)) + 24 * 60) % (24 * 60);
      hh = Math.floor(total / 60);
      mm = total % 60;
    }

    draft[field] =
      `${hh.toString().padStart(2, '0')}:${mm.toString().padStart(2, '0')}`;
    this.rowErrors[date] = '';
    this.refreshViewModel();

    if (input) {
      setTimeout(() => {
        if (adjustHour) {
          input.setSelectionRange(0, 2);
        } else {
          input.setSelectionRange(3, 5);
        }
      });
    }
  }

  onHalfDayToggle(date: string): void {
    const draft = this.getDraft(date);
    if (draft.halfDay) {
      draft.oneDay = false;
      draft.otApproved = false;
    }

    this.onDraftChange(date);
  }

  onOneDayToggle(date: string): void {
    const draft = this.getDraft(date);
    if (draft.oneDay) {
      draft.halfDay = false;
      draft.otApproved = false;
    }

    this.onDraftChange(date);
  }

  toHoursMinutes(totalMinutes: number): string {
    const normalized = Math.max(0, Math.round(totalMinutes));
    const hours = Math.floor(normalized / 60);
    const minutes = normalized % 60;
    return `${hours}h ${minutes.toString().padStart(2, '0')}m`;
  }

  fridayCheckoutSuggestion(): string {
    const fridayDate = this.getRangeDates().find(
      (date) => this.parseDate(date).getDay() === 5,
    );
    if (!fridayDate) {
      return '';
    }

    const fridayDraft = this.getDraft(fridayDate);
    const checkInMinutes = this.toMinutes(fridayDraft.checkIn);

    if (checkInMinutes === null) {
      return '';
    }

    return this.projectCheckoutForRequiredWork(
      checkInMinutes,
      this.weeklySummary.requiredFridayWorkMinutes,
    );
  }

  private refreshViewModel(): void {
    const rangeDates = this.getRangeDates();
    const requiredFridayWorkMinutes =
      this.calculateRequiredFridayWorkMinutes(rangeDates);

    this.weekRows = rangeDates.map((date) => {
      const draft = this.getDraft(date);
      const isHalfDay = draft.halfDay;
      const isOneDay = draft.oneDay;

      let metrics: { presenceMinutes: number; actualMinutes: number } | null =
        null;
      let status: DayStatus = { tone: 'muted', text: 'Chưa có dữ liệu' };
      let suggestions: DayRow['suggestions'] = {};

      if (isOneDay) {
        const excludeMinutes = this.toExcludeMinutes(draft.excludeTime);
        metrics = {
          presenceMinutes: 0,
          actualMinutes: this.applyExcludeMinutes(
            POLICY.oneDayWork,
            excludeMinutes,
          ),
        };
        status = { tone: 'ok', text: 'One day off: 8h48m' };
      } else if (isHalfDay) {
        const excludeMinutes = this.toExcludeMinutes(draft.excludeTime);
        const partialMetrics = this.calculateMetrics(
          draft.checkIn,
          draft.checkOut,
        );
        metrics = {
          presenceMinutes: partialMetrics?.presenceMinutes ?? 0,
          actualMinutes: this.applyExcludeMinutes(
            (partialMetrics?.actualMinutes ?? 0) + POLICY.halfDayWork,
            excludeMinutes,
          ),
        };
        if (draft.checkIn) {
          suggestions = this.buildSuggestions(
            {
              date,
              checkIn: draft.checkIn,
              checkOut: draft.checkOut,
              otApproved: false,
              halfDay: true,
              oneDay: false,
            },
            requiredFridayWorkMinutes,
          );
        }
        status = draft.checkOut
          ? { tone: 'ok', text: 'Half day off: +4h24m (đã checkout)' }
          : { tone: 'muted', text: 'Half day off: +4h24m (chưa checkout)' };
      } else {
        const hasCheckIn = draft.checkIn.trim().length > 0;
        const hasCheckOut = draft.checkOut.trim().length > 0;
        const complete = hasCheckIn && hasCheckOut;
        const isFriday = this.parseDate(date).getDay() === 5;

        if (complete) {
          const pseudoRecord: AttendanceRecord = {
            date,
            checkIn: draft.checkIn,
            checkOut: draft.checkOut,
            otApproved: draft.otApproved,
            halfDay: false,
            oneDay: false,
          };
          metrics = this.calculateMetrics(draft.checkIn, draft.checkOut);
          if (metrics) {
            const excludeMinutes = this.toExcludeMinutes(draft.excludeTime);
            metrics = {
              presenceMinutes: metrics.presenceMinutes,
              actualMinutes: this.applyExcludeMinutes(
                metrics.actualMinutes,
                excludeMinutes,
              ),
            };
          }
          status = this.evaluateDayStatus(pseudoRecord, metrics);
          suggestions = this.buildSuggestions(
            pseudoRecord,
            requiredFridayWorkMinutes,
          );
        } else if (hasCheckIn || hasCheckOut) {
          if (isFriday && hasCheckIn) {
            suggestions = this.buildSuggestions(
              {
                date,
                checkIn: draft.checkIn,
                checkOut: draft.checkOut,
                otApproved: draft.otApproved,
                halfDay: false,
                oneDay: false,
              },
              requiredFridayWorkMinutes,
            );
          }
          status = { tone: 'violation', text: 'Thiếu giờ vào hoặc giờ ra' };
        }
      }

      return {
        date,
        weekday: this.getWeekdayLabel(date),
        draft,
        presenceMinutes: metrics?.presenceMinutes ?? 0,
        actualMinutes: metrics?.actualMinutes ?? 0,
        otMinutes: 0,
        status,
        suggestions,
      };
    });

    const rowMap = new Map(this.weekRows.map((row) => [row.date, row]));

    const totalActualMinutes = rangeDates.reduce((sum, date) => {
      const row = rowMap.get(date);
      if (!row) {
        return sum;
      }

      return sum + this.getCountedActualMinutesForSummary(row);
    }, 0);

    this.weeklySummary = {
      totalActualMinutes,
      weeklyOtMinutes: Math.max(0, totalActualMinutes - POLICY.standardWeek),
      requiredFridayWorkMinutes,
      weeklyViolation: totalActualMinutes > POLICY.maxWeek,
    };

    this.weekRows = this.weekRows.map((row) => {
      const day = this.parseDate(row.date).getDay();

      if (day >= 1 && day <= 4) {
        return {
          ...row,
          otMinutes: Math.max(0, row.actualMinutes - 10 * 60),
        };
      }

      if (day === 5) {
        return {
          ...row,
          otMinutes: Math.max(0, totalActualMinutes - POLICY.standardWeek),
        };
      }

      return {
        ...row,
        otMinutes: 0,
      };
    });

    this.refreshNoOtReminderForToday();
  }

  private syncWeekDraft(): void {
    const map = new Map(this.records.map((record) => [record.date, record]));
    this.weekDraft = {};

    for (const date of this.getRangeDates()) {
      const record = map.get(date);
      const draft = record
        ? {
            checkIn: record.checkIn ?? '',
            checkOut: record.checkOut ?? '',
            excludeTime: this.normalizePersistedExcludeTime(record),
            otApproved: record.otApproved,
            halfDay: Boolean(record.halfDay),
            oneDay: Boolean(record.oneDay),
          }
        : this.createBlankDraft();

      this.weekDraft[date] = draft;
    }
  }

  private getRangeDates(): string[] {
    if (!this.fromDate || !this.toDate) {
      return [];
    }

    const start = this.parseDate(this.fromDate);
    const end = this.parseDate(this.toDate);
    if (start > end) {
      return [];
    }

    const dates: string[] = [];
    const cursor = new Date(start);

    while (cursor <= end) {
      dates.push(this.toISODate(cursor));
      cursor.setDate(cursor.getDate() + 1);
    }

    return dates;
  }

  private getWeekdayLabel(isoDate: string): string {
    const labels = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    return labels[this.parseDate(isoDate).getDay()];
  }

  private getCurrentWeekRange(today: Date): {
    fromDate: string;
    toDate: string;
  } {
    const start = this.getMonday(today);
    const end = new Date(start);
    end.setDate(start.getDate() + 6);

    return {
      fromDate: this.toISODate(start),
      toDate: this.toISODate(end),
    };
  }

  private getDraft(date: string): WeekDraftItem {
    if (!this.weekDraft[date]) {
      this.weekDraft[date] = this.createBlankDraft();
    }

    return this.weekDraft[date];
  }

  private createBlankDraft(): WeekDraftItem {
    return {
      checkIn: '',
      checkOut: '',
      excludeTime: '',
      otApproved: false,
      halfDay: false,
      oneDay: false,
    };
  }

  private validateDraft(
    date: string,
    draft: WeekDraftItem,
  ):
    | { ok: true; empty: true }
    | { ok: true; empty: false; record: AttendanceRecord }
    | { ok: false; message: string } {
    if (draft.halfDay && draft.oneDay) {
      return {
        ok: false,
        message: 'Chỉ chọn một trong hai: half day hoặc One day off.',
      };
    }

    const excludeTime = draft.excludeTime.trim();
    const parsedExcludeTime = this.parseNaturalTime(excludeTime, true);
    if (excludeTime && !parsedExcludeTime) {
      return {
        ok: false,
        message: 'Exclude time không hợp lệ. Ví dụ: 0130, 1h30, 01:30.',
      };
    }

    if (draft.oneDay) {
      return {
        ok: true,
        empty: false,
        record: {
          date,
          excludeTime: parsedExcludeTime || undefined,
          otApproved: false,
          halfDay: false,
          oneDay: true,
          source: 'manual',
        },
      };
    }

    if (draft.halfDay) {
      const checkIn = draft.checkIn.trim();
      const checkOut = draft.checkOut.trim();

      if ((checkIn && !checkOut) || (!checkIn && checkOut)) {
        return {
          ok: false,
          message: 'Half day off: nếu nhập giờ thì cần đủ check-in/check-out.',
        };
      }

      if (checkIn && checkOut) {
        const metrics = this.calculateMetrics(checkIn, checkOut);
        if (!metrics) {
          return { ok: false, message: 'Giờ ra phải lớn hơn giờ vào.' };
        }

        const checkInMinutes = this.toMinutes(checkIn);
        if (
          checkInMinutes !== null &&
          checkInMinutes < POLICY.earliestCheckIn
        ) {
          return { ok: false, message: 'Check-in không được sớm hơn 06:00.' };
        }
      }

      return {
        ok: true,
        empty: false,
        record: {
          date,
          checkIn: checkIn || undefined,
          checkOut: checkOut || undefined,
          excludeTime: parsedExcludeTime || undefined,
          otApproved: false,
          halfDay: true,
          oneDay: false,
          source: 'manual',
        },
      };
    }

    const checkIn = draft.checkIn.trim();
    const checkOut = draft.checkOut.trim();

    if (excludeTime && !checkIn && !checkOut) {
      return {
        ok: false,
        message: 'Cần nhập check-in/check-out trước khi nhập exclude time.',
      };
    }

    if (!checkIn && !checkOut) {
      return { ok: true, empty: true };
    }

    if (!checkIn || !checkOut) {
      return { ok: false, message: 'Cần nhập đủ check-in/check-out.' };
    }

    const metrics = this.calculateMetrics(checkIn, checkOut);
    if (!metrics) {
      return { ok: false, message: 'Giờ ra phải lớn hơn giờ vào.' };
    }

    const checkInMinutes = this.toMinutes(checkIn);
    if (checkInMinutes !== null && checkInMinutes < POLICY.earliestCheckIn) {
      return { ok: false, message: 'Check-in không được sớm hơn 06:00.' };
    }

    return {
      ok: true,
      empty: false,
      record: {
        date,
        checkIn,
        checkOut,
        excludeTime: parsedExcludeTime || undefined,
        otApproved: draft.otApproved,
        halfDay: false,
        oneDay: false,
        source: 'manual',
      },
    };
  }

  private upsertRecord(incoming: AttendanceRecord): void {
    const index = this.records.findIndex(
      (record) => record.date === incoming.date,
    );
    if (index >= 0) {
      this.records[index] = incoming;
    } else {
      this.records.push(incoming);
    }

    this.records = this.records
      .slice()
      .sort((a, b) => a.date.localeCompare(b.date));
  }

  private removeRecordByDate(date: string): void {
    this.records = this.records.filter((record) => record.date !== date);
  }

  private isManualRecord(record: AttendanceRecord): boolean {
    return record.source !== 'api';
  }

  private buildSuggestions(
    record?: AttendanceRecord,
    fridayRequiredWorkMinutes: number = POLICY.standardWork,
  ): DayRow['suggestions'] {
    if (!record || !record.checkIn) {
      return {};
    }

    const checkInMinutes = this.toMinutes(record.checkIn);
    if (checkInMinutes === null) {
      return {};
    }

    const isFriday = this.parseDate(record.date).getDay() === 5;
    const standardWorkTarget = isFriday
      ? fridayRequiredWorkMinutes
      : POLICY.standardWork;

    const maxNoOtByPresence = checkInMinutes + POLICY.maxPresenceNoOT;
    const maxNoOtByWork = this.projectCheckoutMinuteForRequiredWork(
      checkInMinutes,
      POLICY.maxActualNoOT,
    );

    const violationByPresence = checkInMinutes + POLICY.violationPresence;
    const violationByWork = this.projectCheckoutMinuteForRequiredWork(
      checkInMinutes,
      POLICY.maxActualNoOT + 1,
    );

    const maxWithOtByPresence = checkInMinutes + POLICY.maxPresenceWithOT;
    const maxWithOtByWork = this.projectCheckoutMinuteForRequiredWork(
      checkInMinutes,
      POLICY.maxActualWithOT,
    );

    return {
      standardCheckout: this.projectCheckoutForRequiredWork(
        checkInMinutes,
        standardWorkTarget,
      ),
      maxNoOt: this.formatClock(Math.min(maxNoOtByPresence, maxNoOtByWork)),
      violation: this.formatClock(
        Math.min(violationByPresence, violationByWork),
      ),
      maxWithOt: this.formatClock(
        Math.min(maxWithOtByPresence, maxWithOtByWork),
      ),
    };
  }

  private evaluateDayStatus(
    record: AttendanceRecord | undefined,
    metrics: ReturnType<AppComponent['calculateMetrics']> | null,
  ): DayStatus {
    if (!record) {
      return { tone: 'muted', text: 'Chưa có dữ liệu' };
    }

    if (!metrics) {
      return { tone: 'violation', text: 'Giờ vào/ra không hợp lệ' };
    }

    if (!record.checkIn) {
      return { tone: 'violation', text: 'Thiếu giờ vào' };
    }

    const hasCheckedOut = Boolean(record.checkOut);
    const checkInMinutes = this.toMinutes(record.checkIn);
    if (checkInMinutes === null || checkInMinutes < POLICY.earliestCheckIn) {
      return { tone: 'violation', text: 'Check-in sớm hơn 06:00' };
    }

    if (record.otApproved) {
      if (
        metrics.presenceMinutes > POLICY.maxPresenceWithOT ||
        metrics.actualMinutes > POLICY.maxActualWithOT
      ) {
        return { tone: 'violation', text: 'Vượt giới hạn dù đã đăng ký OT' };
      }

      return { tone: 'ok', text: 'OT hợp lệ' };
    }

    if (metrics.presenceMinutes >= POLICY.violationPresence) {
      return { tone: 'violation', text: 'Vượt 11h15 khi chưa đăng ký OT' };
    }

    if (
      metrics.presenceMinutes >= POLICY.maxPresenceNoOT ||
      metrics.actualMinutes > POLICY.maxActualNoOT
    ) {
      return { tone: 'warning', text: 'Sắp vượt giới hạn không OT' };
    }

    if (metrics.presenceMinutes >= POLICY.standardPresence) {
      return { tone: 'ok', text: 'Đã đạt giờ tiêu chuẩn' };
    }

    if (hasCheckedOut) {
      return {
        tone: 'warning',
        text: 'Đã checkout nhưng chưa đủ giờ tiêu chuẩn',
      };
    }

    return { tone: 'muted', text: 'Đang trong ca làm' };
  }

  private calculateMetrics(
    checkIn: string,
    checkOut: string,
  ): { presenceMinutes: number; actualMinutes: number } | null {
    const inMinutes = this.toMinutes(checkIn);
    const outMinutes = this.toMinutes(checkOut);

    if (inMinutes === null || outMinutes === null || outMinutes <= inMinutes) {
      return null;
    }

    const presenceMinutes = outMinutes - inMinutes;
    const lunchOverlap = this.overlapMinutes(
      inMinutes,
      outMinutes,
      POLICY.lunchStart,
      POLICY.lunchEnd,
    );

    return {
      presenceMinutes,
      actualMinutes: Math.max(0, presenceMinutes - lunchOverlap),
    };
  }

  private projectCheckoutForRequiredWork(
    checkInMinutes: number,
    requiredWorkMinutes: number,
  ): string {
    const checkout = this.projectCheckoutMinuteForRequiredWork(
      checkInMinutes,
      requiredWorkMinutes,
    );
    return this.formatClock(checkout);
  }

  private projectCheckoutMinuteForRequiredWork(
    checkInMinutes: number,
    requiredWorkMinutes: number,
  ): number {
    let checkout = checkInMinutes;
    let workedMinutes = 0;

    while (
      workedMinutes < requiredWorkMinutes &&
      checkout < checkInMinutes + 24 * 60
    ) {
      const minuteOfDay = checkout % (24 * 60);
      const isLunchMinute =
        minuteOfDay >= POLICY.lunchStart && minuteOfDay < POLICY.lunchEnd;

      if (!isLunchMinute) {
        workedMinutes += 1;
      }

      checkout += 1;
    }

    return checkout;
  }

  private overlapMinutes(
    startA: number,
    endA: number,
    startB: number,
    endB: number,
  ): number {
    const start = Math.max(startA, startB);
    const end = Math.min(endA, endB);
    return Math.max(0, end - start);
  }

  private applyExcludeMinutes(
    actualMinutes: number,
    excludeMinutes: number,
  ): number {
    const safeExclude = Math.max(0, Math.floor(excludeMinutes || 0));
    return Math.max(0, actualMinutes - safeExclude);
  }

  private calculateRequiredFridayWorkMinutes(rangeDates: string[]): number {
    const monThuCounted = rangeDates.reduce((sum, date) => {
      const day = this.parseDate(date).getDay();
      if (day < 1 || day > 4) {
        return sum;
      }

      const actual = this.calculateDraftCountedActualMinutes(
        date,
        this.getDraft(date),
      );
      return sum + Math.min(actual, POLICY.maxCountedMonThuForFriday);
    }, 0);

    return Math.max(0, POLICY.standardWeek - monThuCounted);
  }

  private calculateDraftActualMinutes(draft: WeekDraftItem): number {
    const excludeMinutes = this.toExcludeMinutes(draft.excludeTime);

    if (draft.oneDay) {
      return this.applyExcludeMinutes(POLICY.oneDayWork, excludeMinutes);
    }

    if (draft.halfDay) {
      const partialMetrics = this.calculateMetrics(
        draft.checkIn,
        draft.checkOut,
      );
      const halfDayActual =
        (partialMetrics?.actualMinutes ?? 0) + POLICY.halfDayWork;
      return this.applyExcludeMinutes(halfDayActual, excludeMinutes);
    }

    const metrics = this.calculateMetrics(draft.checkIn, draft.checkOut);
    if (!metrics) {
      return 0;
    }

    return this.applyExcludeMinutes(metrics.actualMinutes, excludeMinutes);
  }

  private calculateDraftCountedActualMinutes(
    date: string,
    draft: WeekDraftItem,
  ): number {
    const actual = this.calculateDraftActualMinutes(draft);
    const metrics = this.calculateMetrics(draft.checkIn, draft.checkOut);
    const presence = metrics?.presenceMinutes ?? 0;
    return this.applyNoOtViolationPenalty(actual, presence, draft.otApproved);
  }

  private getCountedActualMinutesForSummary(row: DayRow): number {
    return this.applyNoOtViolationPenalty(
      row.actualMinutes,
      row.presenceMinutes,
      row.draft.otApproved,
    );
  }

  private applyNoOtViolationPenalty(
    actualMinutes: number,
    presenceMinutes: number,
    otApproved: boolean,
  ): number {
    if (otApproved || presenceMinutes < POLICY.violationPresence) {
      return actualMinutes;
    }

    return Math.max(0, actualMinutes - 15);
  }

  private refreshNoOtReminderForToday(): void {
    if (!('Notification' in window)) {
      return;
    }

    if (this.noOtReminderTimeoutId !== null) {
      window.clearTimeout(this.noOtReminderTimeoutId);
      this.noOtReminderTimeoutId = null;
    }
    this.noOtReminderKey = '';

    const today = this.toISODate(new Date());
    const draft = this.weekDraft[today];
    if (!draft || draft.oneDay) {
      return;
    }

    const checkInMinutes = this.toMinutes(draft.checkIn);
    if (checkInMinutes === null) {
      return;
    }

    if (
      Notification.permission === 'default' &&
      !this.attemptedNotificationPermission
    ) {
      this.attemptedNotificationPermission = true;
      Notification.requestPermission().then(() => {
        this.refreshNoOtReminderForToday();
      });
      return;
    }

    if (Notification.permission !== 'granted') {
      return;
    }

    const thresholdMinute = Math.min(
      checkInMinutes + POLICY.maxPresenceNoOT,
      this.projectCheckoutMinuteForRequiredWork(
        checkInMinutes,
        POLICY.maxActualNoOT,
      ),
    );
    const thresholdAt = this.toDateAtMinuteOfDay(today, thresholdMinute);
    if (!thresholdAt) {
      return;
    }

    const reminderKey = `${today}-${checkInMinutes}-${thresholdMinute}`;
    this.noOtReminderKey = reminderKey;

    const fire = (): void => {
      this.noOtReminderTimeoutId = null;
      this.triggerNoOtReminder(reminderKey);
    };

    const delayMs = thresholdAt.getTime() - Date.now();
    if (delayMs <= 0) {
      fire();
      return;
    }

    this.noOtReminderTimeoutId = window.setTimeout(fire, delayMs);
  }

  private triggerNoOtReminder(reminderKey: string): void {
    if (!('Notification' in window) || Notification.permission !== 'granted') {
      return;
    }

    if (this.noOtReminderKey !== reminderKey) {
      return;
    }

    const sentKey = `no-ot-reminder-${reminderKey}`;
    if (sessionStorage.getItem(sentKey) === '1') {
      return;
    }

    sessionStorage.setItem(sentKey, '1');
    new Notification('Nhắc nhở checkout', {
      body: 'Đã tới mốc sắp vượt giới hạn không OT, bạn nên checkout để tránh vi phạm.',
      tag: `no-ot-warning-${reminderKey}`,
    });
  }

  private toDateAtMinuteOfDay(
    isoDate: string,
    totalMinutes: number,
  ): Date | null {
    if (totalMinutes < 0 || totalMinutes >= 24 * 60) {
      return null;
    }

    const date = this.parseDate(isoDate);
    const hh = Math.floor(totalMinutes / 60);
    const mm = totalMinutes % 60;
    date.setHours(hh, mm, 0, 0);
    return date;
  }

  private toExcludeMinutes(excludeTime: string): number {
    const normalized = this.parseNaturalTime(excludeTime, true);
    if (!normalized) {
      return 0;
    }

    return this.toMinutes(normalized) ?? 0;
  }

  private normalizePersistedExcludeTime(
    record: AttendanceRecord & { excludeMinutes?: number },
  ): string {
    const normalized = this.parseNaturalTime(record.excludeTime ?? '', true);
    if (normalized) {
      return normalized;
    }

    const legacyMinutes = Math.max(0, Math.floor(record.excludeMinutes ?? 0));
    if (!legacyMinutes) {
      return '';
    }

    const hh = Math.floor(legacyMinutes / 60)
      .toString()
      .padStart(2, '0');
    const mm = (legacyMinutes % 60).toString().padStart(2, '0');
    return `${hh}:${mm}`;
  }

  private normalizeTimeForTyping(rawTime: string): string {
    const trimmed = rawTime.trim().toLowerCase();
    if (!trimmed) {
      return '';
    }

    const hasSeparator = /[:h\.\-_\s]/.test(trimmed);
    const digits = trimmed.replace(/\D/g, '').slice(0, 4);
    if (!digits) {
      return '';
    }

    if (!hasSeparator) {
      if (digits.length === 4) {
        return `${digits.slice(0, 2)}:${digits.slice(2)}`;
      }
      return digits;
    }

    const normalized = this.parseNaturalTime(trimmed, false);
    if (normalized) {
      return normalized;
    }

    if (digits.length <= 2) {
      return digits;
    }

    if (digits.length === 3) {
      return `${digits[0]}:${digits.slice(1)}`;
    }

    return `${digits.slice(0, 2)}:${digits.slice(2)}`;
  }

  private parseNaturalTime(
    rawTime: string,
    allowHourOnly: boolean,
  ): string | null {
    const raw = rawTime.trim().toLowerCase();
    if (!raw) {
      return '';
    }

    const parts = raw
      .replace(/[h\.\-_\s]+/g, ':')
      .replace(/[^\d:]/g, '')
      .split(':')
      .filter((part) => part.length > 0);

    if (parts.length >= 2) {
      const hh = Number(parts[0]);
      const mm = Number(parts[1]);

      if (
        !Number.isInteger(hh) ||
        !Number.isInteger(mm) ||
        hh < 0 ||
        hh > 23 ||
        mm < 0 ||
        mm > 59
      ) {
        return null;
      }

      return `${hh.toString().padStart(2, '0')}:${mm.toString().padStart(2, '0')}`;
    }

    const digits = raw.replace(/\D/g, '').slice(0, 4);
    if (!digits) {
      return '';
    }

    if (digits.length <= 2) {
      if (!allowHourOnly) {
        return null;
      }

      const hh = Number(digits);
      if (!Number.isInteger(hh) || hh < 0 || hh > 23) {
        return null;
      }

      return `${hh.toString().padStart(2, '0')}:00`;
    }

    if (digits.length === 3) {
      const hh = Number(digits[0]);
      const mm = Number(digits.slice(1));

      if (
        !Number.isInteger(hh) ||
        !Number.isInteger(mm) ||
        hh < 0 ||
        hh > 23 ||
        mm < 0 ||
        mm > 59
      ) {
        return null;
      }

      return `${hh.toString().padStart(2, '0')}:${mm.toString().padStart(2, '0')}`;
    }

    const hh = Number(digits.slice(0, 2));
    const mm = Number(digits.slice(2));

    if (
      !Number.isInteger(hh) ||
      !Number.isInteger(mm) ||
      hh < 0 ||
      hh > 23 ||
      mm < 0 ||
      mm > 59
    ) {
      return null;
    }

    return `${hh.toString().padStart(2, '0')}:${mm.toString().padStart(2, '0')}`;
  }

  private toMinutes(time: string): number | null {
    const normalized = this.parseNaturalTime(time, false);
    if (!normalized) {
      return null;
    }

    const [hhText, mmText] = normalized.split(':');
    const hh = Number(hhText);
    const mm = Number(mmText);

    if (
      !Number.isInteger(hh) ||
      !Number.isInteger(mm) ||
      hh < 0 ||
      hh > 23 ||
      mm < 0 ||
      mm > 59
    ) {
      return null;
    }

    return hh * 60 + mm;
  }

  private formatClock(totalMinutes: number): string {
    const dayMinutes = 24 * 60;
    const dayOffset = Math.floor(totalMinutes / dayMinutes);
    const minuteOfDay = ((totalMinutes % dayMinutes) + dayMinutes) % dayMinutes;

    const hh = Math.floor(minuteOfDay / 60)
      .toString()
      .padStart(2, '0');
    const mm = (minuteOfDay % 60).toString().padStart(2, '0');

    if (dayOffset <= 0) {
      return `${hh}:${mm}`;
    }

    return `${hh}:${mm} (+${dayOffset}d)`;
  }

  private getMonday(date: Date): Date {
    const local = new Date(date.getFullYear(), date.getMonth(), date.getDate());
    const day = local.getDay();
    const shift = day === 0 ? -6 : 1 - day;
    local.setDate(local.getDate() + shift);
    return local;
  }

  private toISODate(date: Date): string {
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  private parseDate(isoDate: string): Date {
    const [year, month, day] = isoDate.split('-').map(Number);
    return new Date(year, month - 1, day);
  }

  private loadRecords(): AttendanceRecord[] {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return [];
    }

    try {
      const parsed = JSON.parse(raw) as Array<
        AttendanceRecord & { excludeMinutes?: number }
      >;
      if (!Array.isArray(parsed)) {
        return [];
      }

      return parsed
        .filter((item) => Boolean(item?.date))
        .map((item) => {
          return {
            date: item.date,
            checkIn: item.checkIn,
            checkOut: item.checkOut,
            excludeTime: this.normalizePersistedExcludeTime(item) || undefined,
            otApproved: Boolean(item.otApproved),
            halfDay: Boolean(item.halfDay),
            oneDay: Boolean(item.oneDay),
            source: item.source === 'api' ? 'api' : 'manual',
          };
        });
    } catch {
      return [];
    }
  }

  private persistRecords(): void {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(this.records));
  }
}
