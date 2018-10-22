import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { UsersService } from '../users.service';
import { User } from '../user.model';

@Component({
  selector: 'app-user-create',
  templateUrl: './user-create.component.html',
  styleUrls: ['./user-create.component.scss']
})
export class UserCreateComponent implements OnInit {
  newUser: User;

  constructor( public usersService: UsersService) { }

  ngOnInit() {
  }

  onAddUser(form: NgForm){
    if(form.invalid){
      return
    }
    this.newUser = {id: 'id', name: form.value.userName, surname: form.value.userSurname},
    this.usersService.addUser(this.newUser);
  }
}
