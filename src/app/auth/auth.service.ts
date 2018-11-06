import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { AuthUserData } from './auth-user-data.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  //TODO - change into user object
  private loggedInUserId: string;
  private userIsAuthenticated = false;
  private token: string;
  private tokenTimer: any;
  private authStatusListener = new Subject<boolean>();

  //AuthUserData model is the same model as user, but contains password
  //It was created to store user with password, to prevent password field beeing attached in normal User model
  private authData: AuthUserData;

  constructor(private http: HttpClient, private router: Router) { }

  createUser(name: string, surname: string, email: string, password: string){
    const userData: AuthUserData = {
      name: name,
      surname: surname,
      email: email,
      password: password
    }
    //when we return http request and want to subscribe to it, we need to do it in a component
    this.http.post("http://localhost:3000/api/user/signup", userData)
    .subscribe(()=>{
        this.router.navigate(["/"]);
      }, error => {
        this.authStatusListener.next(false);
      }
    );
  }

  login(name: string, surname: string, email: string, password: string){
    const authData: AuthUserData = {
      name: name,
      surname: surname,
      email: email,
      password: password
    };
    this.http.post<{token: string, expiresIn: number, userId: string}>("http://localhost:3000/api/user/login", authData).subscribe(
      response => {
        const loginToken = response.token;
        this.token = loginToken;

        if(loginToken){
          this.userIsAuthenticated = true;
          this.authStatusListener.next(true);
          const expiresInDuration = response.expiresIn;
          //*1000 convert to seconds (timer works on miliseconds)
          this.setAuthTimer(expiresInDuration * 1000);
          const now = new Date();
          const expirationDate = new Date(now.getTime() + expiresInDuration * 1000);
          this.loggedInUserId = response.userId;
          this.saveAuthData(loginToken, expirationDate, this.loggedInUserId)
          this.router.navigate(['/']);
        }
      }, error => {
        this.authStatusListener.next(false);
      }
    );
  }

  getToken() {
    return this.token;
  }

  getUserIsAuth(){
    return this.userIsAuthenticated;
  }

  getUserId(){
    return this.loggedInUserId;
  }

  getAuthStatusListener(){
    //asObservable - allows to emit only from service, not from anywhere else
    return this.authStatusListener.asObservable();
  }

  private saveAuthData(token: string, expirationDate: Date, userId: string){
    localStorage.setItem('token', token);
    localStorage.setItem('expiration', expirationDate.toISOString());
    localStorage.setItem('userId', userId);
  }

  private setAuthTimer(duration: number){
    this.tokenTimer = setTimeout(
      () => {
        this.logout();
      }, duration
    );
  }

  autoAuthUser(){
    const authInformation = this.getAuthData();
    if (!authInformation){
      return;
    }
    const now = new Date();
    const expiresIn = authInformation.expirationDate.getTime() - now.getTime();
    if(expiresIn > 0){
      this.token = authInformation.token;
      this.userIsAuthenticated = true;
      this.loggedInUserId = authInformation.userId;
      this.setAuthTimer(expiresIn);//expiresIn is in miliseconds and Auth timer works with seconds
      this.authStatusListener.next(true);
    }
  }

  private clearAuthData() {
    localStorage.removeItem("token");
    localStorage.removeItem("expiration");
    localStorage.removeItem('userId');
  }

  private getAuthData(){
    const token = localStorage.getItem("token");
    const expirationDate = localStorage.getItem("expiration");
    const userId = localStorage.getItem("userId");
    if(!token && expirationDate){
      return;
    }
    return{
      token: token,
      expirationDate: new Date(expirationDate),
      userId: userId
    }
  }

  logout(){
    this.token = null;
    this.userIsAuthenticated = false;
    this.authStatusListener.next(false);
    clearTimeout(this.tokenTimer);
    this.clearAuthData();
    this.loggedInUserId = null;
    this.router.navigate(['/']);
  }
}
