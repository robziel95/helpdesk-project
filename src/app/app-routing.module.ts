import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router"
import { DashboardComponent } from "./dashboard/dashboard.component";
import { UsersListComponent } from "./users/users-list/users-list.component";
import { UserCreateComponent } from "./users/user-create/user-create.component";
import { TicketListComponent } from "./tickets/ticket-list/ticket-list.component";
import { TicketSubmitComponent } from "./tickets/ticket-submit/ticket-submit.component";


const routes: Routes = [
  { path: '', component: DashboardComponent },
  { path: 'users', component: UsersListComponent },
  { path: 'create-user', component: UserCreateComponent },
  { path: 'edit-user/:userId', component: UserCreateComponent },
  { path: 'tickets', component: TicketListComponent },
  { path: 'submit-ticket', component: TicketSubmitComponent },
  { path: 'login', component: DashboardComponent },
  { path: 'logout', component: DashboardComponent },
  { path: 'edit-ticket/:ticketId', component: TicketSubmitComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}