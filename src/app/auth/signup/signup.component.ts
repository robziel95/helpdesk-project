import { Component, OnInit, OnDestroy } from '@angular/core';
import { NgForm } from '@angular/forms';
import { UsersService } from 'src/app/users/users.service';
import { User } from 'src/app/users/user.model';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignupComponent implements OnInit, OnDestroy {
  spinnerLoading = false;
  inputUserData: User;
  private createUserError: Subscription;

  constructor(public usersService: UsersService) {}

  ngOnInit() {
    this.createUserError = this.usersService.getErrorThrownListener().subscribe(
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
      password: form.value.password
    };
    console.log(this.inputUserData);
    this.spinnerLoading = true;
    this.usersService.addUser(this.inputUserData);
  }

  ngOnDestroy(){
    this.createUserError.unsubscribe();
  }
}
