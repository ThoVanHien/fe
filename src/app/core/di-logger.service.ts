import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DiLoggerService {
  readonly instanceId = Math.random().toString(36).slice(2, 8);
  readonly entries: string[] = [];

  log(message: string): void {
    this.entries.unshift(`${new Date().toLocaleTimeString('vi-VN')}: ${message}`);
    this.entries.splice(6);
  }
}
