import { Component, OnInit, OnDestroy } from '@angular/core';
import { AuthService } from '../auth/auth.service';
import { Subscription } from 'rxjs';
import { User } from '../users/user.model';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit, OnDestroy{
  loggedUser: User = {
    id: "", name: "", surname: "", email: "", userType: "", nickname: null
  };
  private authListenerSubscription: Subscription;
  userIsAuthenticated = false;

  constructor(private authService: AuthService) { }

  ngOnInit() {
    this.userIsAuthenticated = this.authService.getUserIsAuth();
    this.authListenerSubscription = this.authService.getAuthStatusListener()
    .subscribe(
      isAuthenticated => {
        this.userIsAuthenticated = isAuthenticated;
        this.loggedUser = this.authService.getLoggedInUser();
      }
    );
  }

  onLogout(){
    this.authService.logout();
  }

  ngOnDestroy(){
    this.authListenerSubscription.unsubscribe();
  }
}
