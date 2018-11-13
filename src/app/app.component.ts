import { Component, OnInit, OnDestroy } from '@angular/core';
import { AuthService } from './auth/auth.service';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material';
import { Subscription } from 'rxjs';
import { UsersService } from './users/users.service';
import { SharedService } from './shared/shared.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy {
  title = 'helpdesk-project';
  private openSnackbarSubscription: Subscription;

  constructor(private authService: AuthService,
    private snackBar: MatSnackBar,
    private usersService: UsersService,
    private sharedService: SharedService) {}

  ngOnInit(){
    this.authService.autoAuthUser();
    this.openSnackbarSubscription = this.sharedService.getOpenSnackbarListener().subscribe(
      openSnackbarMessage => {
        let config = new MatSnackBarConfig();
        config.verticalPosition = 'bottom';
        config.horizontalPosition = 'right';
        config.duration = 3000;
        this.snackBar.open(<string>openSnackbarMessage, 'OK', config);
      }
    );
  }

  ngOnDestroy(){
    this.openSnackbarSubscription.unsubscribe();
  }
}
