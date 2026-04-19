import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private admin = false;

  get isAdmin(): boolean {
    return this.admin;
  }

  login(email: string, password: string): boolean {
    this.admin = email.trim().toLowerCase() === 'admin@learning.test' && password === 'admin123';
    return this.admin;
  }

  logout(): void {
    this.admin = false;
  }
}

