import { Injectable } from '@angular/core';
import { User } from './user.model';
import { Subject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { Router } from '@angular/router';


@Injectable({
  providedIn: 'root'
})
export class UsersService {
  private users: User [] = [];
  private usersUpdated = new Subject<User[]>();
  private errorThrown = new Subject<boolean>();

  constructor(private http: HttpClient, private router: Router) { }

  getUsers(){
    this.http.get<{message: string, users: any}>('http://localhost:3000/api/users')
    .pipe(map(
      (userData) => {
        return userData.users.map(user => {
          return{
            id: user._id,
            name: user.name,
            surname: user.surname,
            email: user.email,
            password: user.password
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

  getErrorThrownListener(){
    return this.errorThrown.asObservable();
  }

  addUser(inputUser: User){
    const newUser: User = inputUser;
    this.http.post<{message: string, userId: string}>('http://localhost:3000/api/users/create', newUser)
    .subscribe(
    ()=>{
      this.router.navigate(['/users']);
    }, error => {
      this.errorThrown.next();
    }
  );
  }

  getUser(id: string){
    return this.http.get<{_id: string; name: string; surname: string; email:string; password: string}>('http://localhost:3000/api/users/' + id);
  }

  updateUser(inputUser: User){
    const userToUpdate: User = {
      id: inputUser.id,
      name: inputUser.name,
      surname: inputUser.surname,
      email: inputUser.email,
      password: inputUser.password
    };
    this.http.put('http://localhost:3000/api/users/' + userToUpdate.id, userToUpdate).subscribe(
      (response) => {
        const usersUpdated = [...this.users];
        const oldUserIndex = usersUpdated.findIndex( u => u.id === userToUpdate.id);
        usersUpdated[oldUserIndex] = userToUpdate;
        this.users = usersUpdated;
        this.usersUpdated.next([...this.users]);
        this.router.navigate(['/users']);
      }
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
