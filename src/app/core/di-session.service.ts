import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DiSessionService {
  readonly instanceId = Math.random().toString(36).slice(2, 8);
  readonly createdAt = new Date().toLocaleTimeString('vi-VN');

  visitCount = 1;

  incrementVisits(): void {
    this.visitCount += 1;
  }
}
