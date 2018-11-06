import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { UsersService } from 'src/app/users/users.service';
import { User } from 'src/app/users/user.model';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignupComponent implements OnInit {
  spinnerLoading = false;
  inputUserData: User;

  constructor(public usersService: UsersService) {}

  ngOnInit() {
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
}
