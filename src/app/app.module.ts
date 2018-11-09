import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatInputModule, MatCardModule, MatButtonModule, MatExpansionModule, MatProgressSpinnerModule, MatSelectModule, MatDialogModule, MatSnackBarModule, MatPaginatorModule } from '@angular/material';

import { AppComponent } from './app.component';
import { HeaderComponent } from './header/header.component';
import { UserCreateComponent } from './users/user-create/user-create.component';
import { UsersListComponent } from './users/users-list/users-list.component';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { TicketListComponent } from './tickets/ticket-list/ticket-list.component';
import { TicketSubmitComponent } from './tickets/ticket-submit/ticket-submit.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { AppRoutingModule } from './app-routing.module';
import { LoginComponent } from './auth/login/login.component';
import { SignupComponent } from './auth/signup/signup.component';
import { AuthInterceptor } from './auth/auth-interceptor';
import { ErrorInterceptor } from './error-interceptor';
import { ErrorComponent } from './error/error.component';


@NgModule({
   declarations: [
      AppComponent,
      HeaderComponent,
      UserCreateComponent,
      UsersListComponent,
      TicketListComponent,
      TicketSubmitComponent,
      DashboardComponent,
      LoginComponent,
      SignupComponent,
      ErrorComponent
   ],
   imports: [
      BrowserModule,
      AppRoutingModule,
      BrowserAnimationsModule,
      FormsModule,
      MatInputModule,
      MatCardModule,
      MatButtonModule,
      MatExpansionModule,
      MatSelectModule,
      HttpClientModule,
      MatProgressSpinnerModule,
      MatDialogModule,
      MatSnackBarModule,
      MatPaginatorModule
   ],
   //Add custom interceptor and allow for multi request
   providers: [
     {provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true},
     {provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true}
    ],
   bootstrap: [
      AppComponent
   ],
   entryComponents: [ErrorComponent]
})
export class AppModule { }
