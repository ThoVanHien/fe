export type AttendanceRecord = {
  date: string;
  checkIn?: string;
  checkOut?: string;
  excludeTime?: string;
  otApproved: boolean;
  halfDay?: boolean;
  oneDay?: boolean;
  source?: 'manual' | 'api';
};

export type WeekDraftItem = {
  checkIn: string;
  checkOut: string;
  excludeTime: string;
  otApproved: boolean;
  halfDay: boolean;
  oneDay: boolean;
};

export type TimeField = 'checkIn' | 'checkOut' | 'excludeTime';

export type DayStatus = {
  tone: 'ok' | 'warning' | 'violation' | 'muted';
  text: string;
};

export type DayRow = {
  date: string;
  weekday: string;
  draft: WeekDraftItem;
  presenceMinutes: number;
  actualMinutes: number;
  otMinutes: number;
  status: DayStatus;
  suggestions: {
    standardCheckout?: string;
    maxNoOt?: string;
    violation?: string;
    maxWithOt?: string;
  };
};

export type WeeklySummary = {
  totalActualMinutes: number;
  weeklyOtMinutes: number;
  requiredFridayWorkMinutes: number;
  weeklyViolation: boolean;
};
