import { Injectable } from '@angular/core';
import { User } from './user.model';
import { Subject } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class UsersService {
  private users: User [] = [];


  private usersUpdated = new Subject<User[]>();

  constructor(private http: HttpClient) { }

  getUsers(){
    this.http.get<{message: string, users: User[]}>('http://localhost:3000/api/users').subscribe(
      (userData) => {
        this.users = userData.users;
        this.usersUpdated.next([...this.users]);
        //return by copy
      }
    );
  }

  getUsersUpdateListener(){
    return this.usersUpdated.asObservable();
  }

  addUser(inputUser: User){
    const newUser: User = inputUser;
    this.http.post<{message: string}>('http://localhost:3000/api/users', newUser).subscribe(
      (responseData) => {
        console.log(responseData.message);
        this.users.push(newUser);
        this.usersUpdated.next([...this.users]);
        //push only on success
      }
    );
  }

  getId(){
    return this.users.length + 1;
  }
}
