import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { User } from '../models/user';
import { GLOBALURL } from './globalUrl';
import { map } from 'rxjs/operators';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private http: HttpClient,
    private router: Router) { }

  isLogin() {
    const loggedIn = localStorage.getItem('token');
    if (loggedIn && loggedIn !== 'undefined' )
      return true;
    else
      return false
  }

  login(user: User){
    return this.http.post<any>(`${GLOBALURL}/auth/login`, user)
    .pipe(map(_resp => {
      if(_resp.isOk){
        this.saveToken(_resp.token);
        return _resp;
      }
    }));
  }

  register(user: User){
    return this.http.post<any>(`${GLOBALURL}/users/create`, user);
  }

  getToken() {
    const token = localStorage.getItem('token');
    return token;
  }

  saveToken(token: string){
    localStorage.setItem('token', token);
  }

  logout(){
    localStorage.removeItem('token');
    this.router.navigate(['/login']);
  }
}
