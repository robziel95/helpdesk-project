import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { AuthUserData } from './auth-user-data.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
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
        console.log(response);
        // this.token = loginToken;
        // if(loginToken){
        //   const expiresInDuration = response.expiresIn * 1000;//convert to seconds
        //   this.setAuthTimer(expiresInDuration);
        //   const now = new Date();
        //   const expirationDate = new Date(now.getTime() + expiresInDuration);

        //   this.isAuthenticated = true;
        //   this.authStatusListener.next(true);
        //   this.userId = response.userId;

        //   this.saveAuthData(loginToken, expirationDate, this.userId)
        //   this.router.navigate(['/']);
        // }
      }, error => {
        this.authStatusListener.next(false);
      }
    );
  }

  getToken() {

  }

  getIsAuth(){

  }

  getAuthStatusListener(){
    //asObservable - allows to emit only from service, not from anywhere else
    return this.authStatusListener.asObservable();
  }

  getUserId(){

  }

  autoAuthUser(){

  }

  logout(){

  }
}