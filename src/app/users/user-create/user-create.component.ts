import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { UsersService } from '../users.service';
import { User } from '../user.model';

@Component({
  selector: 'app-user-create',
  templateUrl: './user-create.component.html',
  styleUrls: ['./user-create.component.scss']
})
export class UserCreateComponent implements OnInit {
  inputUserData: User;
  editedUser: User;
  mode = 'create';
  spinnerLoading = false;
  private userId: string;

  constructor( public usersService: UsersService, public route: ActivatedRoute) { }

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
              password: userData.password
            }
          });
        }else{
          this.mode = 'create';
          this.userId = null;
        }
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
      password: form.value.password
    };
    this.spinnerLoading = true;
    if (this.mode === 'create'){
      this.usersService.addUser(this.inputUserData);
    } else{
      this.inputUserData.id = this.userId;
      this.usersService.updateUser(this.inputUserData);
    }
  }
}
