import { Component, OnInit, OnDestroy } from '@angular/core';
import { NgForm } from '@angular/forms';
import { UsersService } from 'src/app/users/users.service';
import { Subscription } from 'rxjs';
import { AuthUser } from '../auth-user.model';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignupComponent implements OnInit, OnDestroy {
  spinnerLoading = false;
  inputUserData: AuthUser;
  private createUserErrorSub: Subscription;

  constructor(public usersService: UsersService) {}

  ngOnInit() {
    this.createUserErrorSub = this.usersService.getErrorThrownListener().subscribe(
      errorThrown => {
        this.spinnerLoading = false;
      }
    );
  }

  onSignup(form: NgForm){
    if (form.invalid){
      return;
    }
    this.inputUserData = {
      id: null,
      name: form.value.userName,
      surname: form.value.userSurname,
      email: form.value.email,
      password: form.value.password,
      userType: 'employee',
      nickname: form.value.nickname,
      avatarPath: null
    };
    this.spinnerLoading = true;
    console.log(this.inputUserData);
    this.usersService.addUser(this.inputUserData);
  }

  ngOnDestroy(){
    this.createUserErrorSub.unsubscribe();
  }
}
