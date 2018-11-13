import { Component, OnInit, OnDestroy } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { UsersService } from '../users.service';
import { User } from '../user.model';
import { Subscription } from 'rxjs';
import { AuthUser } from 'src/app/auth/auth-user.model';

@Component({
  selector: 'app-user-create',
  templateUrl: './user-create.component.html',
  styleUrls: ['./user-create.component.scss']
})
export class UserCreateComponent implements OnInit, OnDestroy {
  inputUserData: AuthUser;

  mode = 'create';
  spinnerLoading = false;
  editedUser: AuthUser;
  userType = "";
  private userId: string;
  private createUserErrorSub: Subscription;

  constructor(  public usersService: UsersService,
                public route: ActivatedRoute) { }

  ngOnInit() {
    this.route.paramMap.subscribe(
      (paramMap: ParamMap) => {
        if (paramMap.has('userId')){
          this.mode = 'edit';
          this.userId = paramMap.get('userId');
          this.spinnerLoading = true;
          this.usersService.getUser(this.userId).subscribe(userData => {
            this.spinnerLoading = false;
            this.editedUser = {
              id: userData._id,
              name: userData.name,
              surname: userData.surname,
              email: userData.email,
              password: userData.password,
              userType: userData.userType
            }
            this.userType = userData.userType;
          });
        }else{
          this.mode = 'create';
          this.userId = null;
        }
      }
    );
    this.createUserErrorSub = this.usersService.getErrorThrownListener().subscribe(
      errorThrown => {
        this.spinnerLoading = false;
      }
    );
  }

  onSaveUser(form: NgForm){
    if (form.invalid){
      return;
    }
    this.inputUserData = {
      id: null,
      name: form.value.userName,
      surname: form.value.userSurname,
      email: form.value.email,
      password: form.value.password,
      userType: "normal"
    };
    this.spinnerLoading = true;
    if (this.mode === 'create'){
      this.usersService.addUser(this.inputUserData);
    } else{
      this.inputUserData.id = this.userId;
      this.userType ==='admin' ? (this.inputUserData.userType = form.value.type) : (this.inputUserData.userType = this.editedUser.userType);
      this.usersService.updateUser(this.inputUserData);
      console.log(this.inputUserData);
    }
  }

  ngOnDestroy(){
    this.createUserErrorSub.unsubscribe();
  }
}
