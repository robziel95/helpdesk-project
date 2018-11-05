import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { User } from '../users/user.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private authStatusListener = new Subject<boolean>();
  private userData: User;

  constructor(private http: HttpClient, private router: Router) { }

  login(email: string, password: string){

  }

  createUser(name: string, surname: string, email: string, password: string){
    const userData: User = {
      id: null,
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
