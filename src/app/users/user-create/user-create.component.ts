import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
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
  form: FormGroup;
  mode = 'create';
  spinnerLoading = false;
  editedUser: AuthUser;
  userType = "";
  loggedUserIsAuthenticated = false;
  loggedUserIsAdmin = false;
  imagePreview = 'backend\\images\\missing_user_avatar_png.png';
  private userId: string;
  private createUserErrorSub: Subscription;
  private authListenerSubscription: Subscription;

  constructor(  public usersService: UsersService,
                public route: ActivatedRoute,
                private authService: AuthService) { }

  ngOnInit() {
    this.form = new FormGroup({
      userName: new FormControl(null, {validators: [Validators.required]}),
      userSurname: new FormControl(null, {validators: [Validators.required]}),
      email: new FormControl(null, {validators: [Validators.required]}),
      password: new FormControl(null, {validators: [Validators.required]}),
      userType: new FormControl(null, {validators: [Validators.required]}),
      nickname: new FormControl(null, {}),
      avatar: new FormControl(null, {}),
    });

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
            };
            console.log(this.editedUser );
            this.form.setValue({
              userName: userData.name,
              userSurname: userData.surname,
              email: userData.email,
              password: '',
              userType: userData.userType,
              nickname: userData.nickname
            });
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

  onSaveUser(){
    if (this.form.invalid){
      return;
    }
    this.inputUserData = {
      id: null,
      name: this.form.value.userName,
      surname: this.form.value.userSurname,
      email: this.form.value.email,
      password: this.form.value.password,
      userType: "employee",
      nickname: this.form.value.nickname
    };
    if(this.loggedUserIsAdmin && this.loggedUserIsAuthenticated){
      this.inputUserData.userType = this.form.value.type
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

  onImageChanged(event: Event){
    const file = (event.target as HTMLInputElement).files[0];
    this.form.patchValue({avatar: file});
    this.form.get('avatar').updateValueAndValidity();
    //create reader
    const reader = new FileReader();
    //init reader
    reader.onload = () => {
      //execute after reading
      this.imagePreview = <string>reader.result;
    };
    //start reader (read 'file')
    reader.readAsDataURL(file);
  }

  ngOnDestroy(){
    this.createUserErrorSub.unsubscribe();
    this.authListenerSubscription.unsubscribe();
  }
}
