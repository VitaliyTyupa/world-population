import { Injectable } from '@angular/core';
import {User} from '../interfaces';
import {ApiService} from './api.service';
import {Observable} from 'rxjs';
import {tap} from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private token = null;

  constructor(
    private api: ApiService
  ) { }

  register(user: User): Observable<User> {
    return this.api.register(user);
  }

  login(user: User): Observable<{token: string}> {
    return this.api.login(user).pipe(
      tap(
        ({token}) => {
          localStorage.setItem('auth-token', token);
          this.setToken(token);
        }
      )
    );
  }

  setToken(token: string) {
    this.token = token;
  }

  getToken(): string {
    return this.token;
  }

  isAuthenticateted(): boolean {
    return !!this.token;
  }

  logout() {
    this.setToken(null);
    localStorage.clear();
  }
}
