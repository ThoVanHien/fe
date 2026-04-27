# ⏱️ Work Time Rules Specification

## 1. Definitions

### 1.1 Presence Time
Thời gian hiện diện tại công ty:

presenceTime = checkOut - checkIn

---

### 1.2 Actual Work Time
Thời gian làm việc thực tế (không tính giờ ăn):

actualWorkTime = presenceTime - lunchBreakOverlap

---

## 2. Daily Rules

### 2.1 Basic Constraints

- Earliest check-in: 06:00
- Lunch break: 11:00 → 12:00 (1h)

---

### 2.2 Standard Working Day

- Standard presence time: 9h48m
- Standard actual work time: 8h48m

---

### 2.3 Without OT

- Max presence time: 11h
- Max actual work time: 10h

- Warning threshold: 11h presence
- Violation threshold: 11h15m presence

---

### 2.4 With OT (Approved)

- Max presence time: 13h
- Max actual work time: 12h

---

## 3. Weekly Rules

### 3.1 Working Days

- Main working days: Monday → Friday
- Saturday & Sunday: OT only (rare case)

---

### 3.2 Weekly Targets

- Standard work: 44h (actual work time)
- Max work: 60h (actual work time)
- Max OT: 16h

---

### 3.3 Weekly Calculation

actualWorkWeek =
  mon + tue + wed + thu + fri + sat + sun

weeklyOT =
  max(0, actualWorkWeek - 44h)

if (actualWorkWeek > 60h) {
  status = "VIOLATION_WEEKLY_LIMIT"
}

---

## 4. Early Leave on Friday

### 4.1 Rule

Friday working time depends on total work from Monday → Thursday.

---

### 4.2 Important Constraint

- From Monday → Thursday:
  - Only count max 10h actual work per day
  - Extra time is OT and NOT counted toward 44h

---

### 4.3 Formula

baseWorkForFriday =
  min(mon, 10h)
+ min(tue, 10h)
+ min(wed, 10h)
+ min(thu, 10h)

requiredFridayWork =
  44h - baseWorkForFriday

---

### 4.4 Example

Mon → Thu: 10h/day

=> 10 × 4 = 40h

Friday needs:
44h - 40h = 4h actual work

---

### 4.5 Checkout Example

checkIn = 06:00
requiredWork = 4h

=> checkout = 10:00 (no lunch overlap)

---

## 5. Lunch Break Logic

### Rule

Only subtract lunch if working time overlaps with 11:00 → 12:00

---

### Examples

06:00 → 10:00
=> NO lunch deduction

06:00 → 13:00
=> subtract 1h lunch

---

### Formula

actualWorkMinutes =
  minutesBetween(checkIn, checkOut)
  - overlap(checkIn, checkOut, lunchStart, lunchEnd)

---

## 6. Daily Suggestion Logic

### Standard Checkout

standardCheckout = checkIn + 9h48m

---

### Max Checkout (No OT)

maxCheckoutNoOT = checkIn + 11h

---

### Violation Threshold

violationTime = checkIn + 11h15m

---

### Max Checkout (With OT)

maxCheckoutWithOT = checkIn + 13h

---

## 7. Notification Rules

### Standard Reminder

- At 9h48m presence
- Message: "Bạn đã đủ giờ làm tiêu chuẩn"

---

### Warning

- At 11h presence
- Message: "Bạn sắp vượt giờ nếu chưa đăng ký OT"

---

### Violation

- At 11h15m presence
- Message: "Bạn đã vượt giờ làm việc cho phép"

---

## 8. Weekend Rules

- Saturday & Sunday:
  - All time = OT
  - Included in weekly total (max 60h)

- Rare case → UI không cần ưu tiên hiển thị

---

## 9. Key Principles

1. Weekly rules tính theo actual work time
2. Daily limits tính theo presence time
3. Lunch break không tính là giờ làm
4. OT không ảnh hưởng việc về sớm thứ 6
5. 60h/tuần là hard limit

---

## 10. Data Model

type Attendance = {
  date: string
  checkIn: string
  checkOut: string
}

type Policy = {
  earliestCheckIn: "06:00"

  lunchStart: "11:00"
  lunchEnd: "12:00"

  standardPresence: 588
  standardWork: 528

  maxPresenceNoOT: 660
  violationPresence: 675
  maxPresenceWithOT: 780

  standardWeek: 2640
  maxWeek: 3600
}
