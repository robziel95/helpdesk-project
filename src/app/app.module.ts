import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatInputModule, MatCardModule, MatButtonModule, MatExpansionModule, MatProgressSpinnerModule, MatSelectModule } from '@angular/material';

import { AppComponent } from './app.component';
import { HeaderComponent } from './header/header.component';
import { UserCreateComponent } from './users/user-create/user-create.component';
import { UsersListComponent } from './users/users-list/users-list.component';
import { HttpClientModule } from '@angular/common/http';
import { TicketListComponent } from './tickets/ticket-list/ticket-list.component';
import { TicketSubmitComponent } from './tickets/ticket-submit/ticket-submit.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { AppRoutingModule } from './app-routing.module';


@NgModule({
   declarations: [
      AppComponent,
      HeaderComponent,
      UserCreateComponent,
      UsersListComponent,
      TicketListComponent,
      TicketSubmitComponent,
      DashboardComponent
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
      MatProgressSpinnerModule
   ],
   providers: [],
   bootstrap: [
      AppComponent
   ]
})
export class AppModule { }
