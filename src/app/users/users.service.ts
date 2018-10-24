import { Injectable } from '@angular/core';
import { User } from './user.model';
import { Subject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';


@Injectable({
  providedIn: 'root'
})
export class UsersService {
  private users: User [] = [];
  private usersUpdated = new Subject<User[]>();

  constructor(private http: HttpClient) { }

  getUsers(){
    this.http.get<{message: string, users: any}>('http://localhost:3000/api/users')
    .pipe(map(
      (userData) => {
        return userData.users.map(user => {
          return{
            id: user._id,
            name: user.name,
            surname: user.surname
          };
        });
      }
    ))
    .subscribe(
      //transformedUserData - "_id is converted into just id"
      (transformedUserData) => {
        this.users = transformedUserData;
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
    this.http.post<{message: string, userId: string}>('http://localhost:3000/api/users', newUser).subscribe(
      (responseData) => {
        //update id with the one generated by mongo
        const generatedUserId = responseData.userId;
        newUser.id = generatedUserId;
        this.users.push(newUser);
        this.usersUpdated.next([...this.users]);
        //push only on success
      }
    );
  }

  getUser(id: string){
    return {...this.users.find(user => user.id === id)};
  }

  updateUser(inputUser: User){
    const userToUpdate: User = {id: inputUser.id, name: inputUser.name, surname: inputUser.surname};
    this.http.put('http://localhost:3000/api/users/' + userToUpdate.id, userToUpdate).subscribe(
      response => console.log(response)
    );
  }

  deleteUser(userId: string){
    this.http.delete('http://localhost:3000/api/users/' + userId)
    .subscribe(
      () => {
        const usersUpdated = this.users.filter(user => user.id !== userId)
        this.users = usersUpdated;
        this.usersUpdated.next([...this.users]);
      }
    );
  }
}
