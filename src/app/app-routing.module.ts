import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router"
import { DashboardComponent } from "./dashboard/dashboard.component";
import { UsersListComponent } from "./users/users-list/users-list.component";
import { UserCreateComponent } from "./users/user-create/user-create.component";
import { TicketListComponent } from "./tickets/ticket-list/ticket-list.component";
import { TicketSubmitComponent } from "./tickets/ticket-submit/ticket-submit.component";
import { LoginComponent } from "./auth/login/login.component";
import { AuthGuard } from "./auth/auth.guard";
import { SignupComponent } from "./auth/signup/signup.component";


const routes: Routes = [
  { path: '', component: DashboardComponent },
  { path: 'users', component: UsersListComponent },
  { path: 'create-user', component: UserCreateComponent, canActivate: [AuthGuard] },
  { path: 'edit-user/:userId', component: UserCreateComponent, canActivate: [AuthGuard] },
  { path: 'tickets', component: TicketListComponent },
  { path: 'submit-ticket', component: TicketSubmitComponent, canActivate: [AuthGuard] },
  { path: 'login', component: LoginComponent },
  { path: 'edit-ticket/:ticketId', component: TicketSubmitComponent, canActivate: [AuthGuard] },
  { path: 'signup', component: SignupComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: [AuthGuard]
})
export class AppRoutingModule {}
