import { Component, OnInit, OnDestroy } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { UsersService } from '../users.service';
import { Subscription } from 'rxjs';
import { AuthUser } from 'src/app/auth/auth-user.model';
import { AuthService } from 'src/app/auth/auth.service';

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
  loggedUserIsAuthenticated = false;
  loggedUserIsAdmin = false;
  private userId: string;
  private createUserErrorSub: Subscription;
  private authListenerSubscription: Subscription;

  constructor(  public usersService: UsersService,
                public route: ActivatedRoute,
                private authService: AuthService) { }

  ngOnInit() {
    this.loggedUserIsAuthenticated = this.authService.getUserIsAuth();
    this.loggedUserIsAdmin = this.authService.getUserIsAdmin();
    this.authListenerSubscription = this.authService.getAuthStatusListener()
    .subscribe(
      isAuthenticated => {
        this.loggedUserIsAuthenticated = isAuthenticated;
        this.loggedUserIsAdmin = this.authService.getUserIsAdmin();
      }
    );
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
              userType: userData.userType,
              nickname: userData.nickname
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
      userType: "employee",
      nickname: form.value.nickname
    };
    if(this.loggedUserIsAdmin && this.loggedUserIsAuthenticated){
      this.inputUserData.userType = form.value.type
    }else{
      this.inputUserData.userType = this.editedUser.userType;
    }
    this.spinnerLoading = true;
    if (this.mode === 'create'){
      this.usersService.addUser(this.inputUserData);
    }
    else{
      this.inputUserData.id = this.userId;
      this.usersService.updateUser(this.inputUserData);
    }
  }

  ngOnDestroy(){
    this.createUserErrorSub.unsubscribe();
    this.authListenerSubscription.unsubscribe();
  }
}
