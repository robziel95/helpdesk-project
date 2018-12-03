import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { AuthUser } from './auth-user.model';
import { SharedService } from '../shared/shared.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  //TODO - change into user object
  private loggedInUser: AuthUser = this.clearAuthUser();
  private userIsAuthenticated = false;
  private token: string;
  private tokenTimer: any;
  private authStatusListener = new Subject<boolean>();

  //AuthUserData model is the same model as user, but contains password
  //It was created to store user with password, to prevent password field beeing attached in normal User model
  private authData: AuthUser;

  constructor(private http: HttpClient,
    private router: Router,
    private sharedService: SharedService) { }

  login(name: string, surname: string, email: string, password: string){
    const authData: AuthUser = {
      id: null,
      name: name,
      surname: surname,
      email: email,
      userType: "",
      password: password,
      nickname: null,
      avatarPath: null
    };
    this.http.post<{token: string, expiresIn: number, loggedUser: any}>("http://localhost:3000/api/user/login", authData).subscribe(
      response => {
        const loginToken = response.token;
        this.token = loginToken;

        if(loginToken){
          this.userIsAuthenticated = true;
          this.loggedInUser = {
            id: response.loggedUser._id,
            name: response.loggedUser.name,
            surname: response.loggedUser.surname,
            email: response.loggedUser.email,
            password: response.loggedUser.password,
            userType: response.loggedUser.userType,
            nickname: response.loggedUser.nickname,
            avatarPath: response.loggedUser.avatarPath
          };
          this.authStatusListener.next(true);
          const expiresInDuration = response.expiresIn;
          //*1000 convert to seconds (timer works on miliseconds)
          this.setAuthTimer(expiresInDuration * 1000);
          const now = new Date();
          const expirationDate = new Date(now.getTime() + expiresInDuration * 1000);

          this.saveAuthData(loginToken, expirationDate, this.loggedInUser.id)
          this.router.navigate(['/']);
          this.sharedService.openSnackbar.next('You are now logged in!');
        }
      }, error => {
        this.authStatusListener.next(false);
        this.sharedService.openSnackbar.next('Login failed!');
      }
    );
  }

  getToken() {
    return this.token;
  }

  getUserIsAuth(){
    return this.userIsAuthenticated;
  }

  getUserIsAdmin(){
    return this.loggedInUser.userType === 'administrator' ? true : false;
  }

  getUserId(){
    return this.loggedInUser.id;
  }

  getLoggedInUser(){
    return this.loggedInUser;
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
      this.loggedInUser.id = authInformation.userId;

      this.getUser(this.loggedInUser.id).subscribe(userData => {
        this.loggedInUser = {
          id: userData._id,
          name: userData.name,
          surname: userData.surname,
          email: userData.email,
          password: userData.password,
          userType: userData.userType,
          nickname: userData.nickname,
          avatarPath: userData.avatarPath
        };
        this.setAuthTimer(expiresIn);//expiresIn is in miliseconds and Auth timer works with seconds
        this.authStatusListener.next(true);
      });
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

  private clearAuthUser(){
    let clearUser: AuthUser = {
      id: null, name: null, surname: null, email: null, password: null, userType: null, nickname: null, avatarPath: null
    };
    return clearUser;
  }

  getUser(id: string){
    return this.http.get<{
    _id: string;
    name: string;
    surname: string;
    email:string;
    password: string;
    userType: string;
    nickname: string;
    avatarPath: string;
  }>('http://localhost:3000/api/users/' + id);
  }

  logout(){
    this.token = null;
    this.userIsAuthenticated = false;
    this.authStatusListener.next(false);
    clearTimeout(this.tokenTimer);
    this.clearAuthData();
    this.loggedInUser = this.clearAuthUser();;
    this.router.navigate(['/']);
    this.sharedService.openSnackbar.next('You are now logged out!');
  }
}
