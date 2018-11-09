import { Component, OnInit, OnDestroy } from '@angular/core';
import { User } from '../user.model';
import { UsersService } from '../users.service';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/auth/auth.service';

@Component({
  selector: 'app-users-list',
  templateUrl: './users-list.component.html',
  styleUrls: ['./users-list.component.scss']
})
export class UsersListComponent implements OnInit, OnDestroy{
  users: User [] = [];
  spinnerLoading = false;
  userIsAuthenticated = false;
  private usersSubscription: Subscription;
  private authStatusSubscription: Subscription;

  constructor(public usersService: UsersService,
    private authService: AuthService) { }

  ngOnInit() {
    this.spinnerLoading = true;
    this.usersService.getUsers();
    //update users on change
    this.usersSubscription = this.usersService.getUsersUpdateListener().subscribe(
      //users subscription will get destroyed to avoid memmory leaks
      //.subscribe listens for chamnge in users service array

      (usersChanged: User[]) => {
        this.spinnerLoading = false;
        this.users = usersChanged;
      }
    );
    this.userIsAuthenticated = this.authService.getUserIsAuth();
    this.authStatusSubscription = this.authService.getAuthStatusListener().subscribe(
      isAuthenticated => {
        this.userIsAuthenticated = isAuthenticated;
      }
    );
  }

  onDelete(userId: string){
    this.usersService.deleteUser(userId);
  }

  ngOnDestroy(): void {
    //Called once, before the instance is destroyed.
    //Add 'implements OnDestroy' to the class.

    this.usersSubscription.unsubscribe();
    this.authStatusSubscription.unsubscribe();
  }
}
