import { Injectable } from '@angular/core';
import { User } from './user.model';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UsersService {
  private users: User [] = [
    {id: 1, name: 'John', surname: 'Doe'},
    {id: 2, name: 'Scarlet', surname: 'Johanson'},
    {id: 3, name: 'John', surname: 'Snow'},
    {id: 4, name: 'Tom', surname: 'Cruze'}
  ];

  private usersUpdated = new Subject<User[]>();

  constructor() { }

  getUsers(){
    return [...this.users];
    //return by copy, not reference
  }

  getUsersUpdateListener(){
    return this.usersUpdated.asObservable();
  }

  addUser(inputUser: User){
    const newUser: User = inputUser;
    this.users.push(newUser);
    this.usersUpdated.next([...this.users]);
  }

  getId(){
    return this.users.length + 1;
  }
}
