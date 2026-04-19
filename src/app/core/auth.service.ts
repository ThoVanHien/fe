import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly storageKey = 'router-demo-admin';
  private readonly loggedInSubject = new BehaviorSubject<boolean>(this.readInitialState());

  readonly loggedIn$ = this.loggedInSubject.asObservable();

  isLoggedIn(): boolean {
    return this.loggedInSubject.value;
  }

  login(): void {
    localStorage.setItem(this.storageKey, 'true');
    this.loggedInSubject.next(true);
  }

  logout(): void {
    localStorage.removeItem(this.storageKey);
    this.loggedInSubject.next(false);
  }

  private readInitialState(): boolean {
    return localStorage.getItem(this.storageKey) === 'true';
  }
}
