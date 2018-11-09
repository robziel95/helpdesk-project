import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { AuthUserData } from './auth-user-data.model';
import { User } from '../users/user.model';
import { UsersService } from '../users/users.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  //TODO - change into user object
  private loggedInUser: User = this.clearUser();

  private userIsAuthenticated = false;
  private token: string;
  private tokenTimer: any;
  private authStatusListener = new Subject<boolean>();

  //AuthUserData model is the same model as user, but contains password
  //It was created to store user with password, to prevent password field beeing attached in normal User model
  private authData: AuthUserData;

  constructor(private http: HttpClient,
    private router: Router,
    private usersService: UsersService) { }

  login(name: string, surname: string, email: string, password: string){
    const authData: AuthUserData = {
      name: name,
      surname: surname,
      email: email,
      password: password
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
            password: response.loggedUser.password
          };
          console.log(this.loggedInUser);
          this.authStatusListener.next(true);
          console.log("status emited");
          const expiresInDuration = response.expiresIn;
          //*1000 convert to seconds (timer works on miliseconds)
          this.setAuthTimer(expiresInDuration * 1000);
          const now = new Date();
          const expirationDate = new Date(now.getTime() + expiresInDuration * 1000);

          this.saveAuthData(loginToken, expirationDate, this.loggedInUser.id)
          this.router.navigate(['/']);
          this.usersService.openSnackbar.next('You are now logged in!');
        }
      }, error => {
        this.authStatusListener.next(false);
        this.usersService.openSnackbar.next('Login failed!');
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
    console.log("Auto auth user");
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

      this.usersService.getUser(this.loggedInUser.id).subscribe(userData => {
        this.loggedInUser = {
          id: userData._id,
          name: userData.name,
          surname: userData.surname,
          email: userData.email,
          password: userData.password
        };
        console.log("Auto auth user update");
        console.log(this.loggedInUser);
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

  private clearUser(){
    let clearUser: User = {
      id: null, name: null, surname: null, email: null, password: null
    };
    return clearUser;
  }

  logout(){
    this.token = null;
    this.userIsAuthenticated = false;
    this.authStatusListener.next(false);
    clearTimeout(this.tokenTimer);
    this.clearAuthData();
    this.loggedInUser = this.clearUser();;
    this.router.navigate(['/']);
    this.usersService.openSnackbar.next('You are now logged out!');
  }
}
