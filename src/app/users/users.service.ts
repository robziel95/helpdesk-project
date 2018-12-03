import { Injectable } from '@angular/core';
import { User } from './user.model';
import { Subject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { Router } from '@angular/router';
import { AuthUser } from '../auth/auth-user.model';
import { AuthService } from '../auth/auth.service';
import { SharedService } from '../shared/shared.service';


@Injectable({
  providedIn: 'root'
})
export class UsersService {
  private users: User [] = [];

  private usersUpdated = new Subject<User[]>();
  private errorThrown = new Subject<boolean>();


  constructor(private http: HttpClient, private router: Router, private authService: AuthService, private sharedService: SharedService) { }

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
            password: user.password,
            userType: user.userType,
            nickname: user.nickname,
            avatarPath: user.avatarPath
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

  addUser(inputUser: AuthUser, avatar: File = null){
    //send formData instead of user JSON, formData allow to combine text values and blob (files)
    let userFormData = new FormData;
    for(var key in inputUser){
      userFormData.append(key, inputUser[key]);
    }
    userFormData.append("avatar", avatar);
    console.log(userFormData);
    this.http.post<{message: string, result: any}>('http://localhost:3000/api/users/create', userFormData)
    .subscribe(
      ()=>{
        this.router.navigate(['/users']);
      }, error => {
        this.errorThrown.next();
      }
    );
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

  updateUser(inputUser: AuthUser, avatar: File = null){
    const userToUpdate: AuthUser = {
      id: inputUser.id,
      name: inputUser.name,
      surname: inputUser.surname,
      email: inputUser.email,
      password: inputUser.password,
      userType: inputUser.userType,
      nickname: inputUser.nickname,
      avatarPath: inputUser.avatarPath
    };
    let userFormData = new FormData;
    for(var key in inputUser){
      userFormData.append(key, inputUser[key]);
    }
    if(avatar !== null){
      userFormData.set("avatar", avatar);
    }
    //check if someone wants to add admin permission
    //check if person is authenticated and has admin permission
    if(userToUpdate.userType === 'administrator' && (!this.authService.getUserIsAdmin() || !this.authService.getUserIsAuth())){
      this.router.navigate(['/login']);
      this.sharedService.openSnackbar.next('User update failed, you need to have administrator permission in order to grant admin permission');
      return;
    }

    this.http.put('http://localhost:3000/api/users/' + userToUpdate.id, userFormData).subscribe(
      (response) => {
        this.router.navigate(['/users']);
        this.sharedService.openSnackbar.next('User update success');
      }, error => {
        this.sharedService.openSnackbar.next('User update failed');
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
        this.sharedService.openSnackbar.next('User successfully deleted');
      }
    ), error => {
      this.sharedService.openSnackbar.next('User deletion failed');
    }
  }
}
