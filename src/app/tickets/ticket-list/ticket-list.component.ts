import { Component, OnInit } from '@angular/core';
import { Ticket } from '../ticket.model';
import { TicketsService } from '../tickets.service';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/auth/auth.service';

@Component({
  selector: 'app-ticket-list',
  templateUrl: './ticket-list.component.html',
  styleUrls: ['./ticket-list.component.scss']
})
export class TicketListComponent implements OnInit {
  tickets: Ticket [] = [];
  spinnerLoading = false;
  userIsAuthenticated = false;
  loggedInUserId: string;
  private ticketsSubscription: Subscription;
  private authStatusSubscription: Subscription;


  constructor(public ticketsService: TicketsService,
    private authService: AuthService) { }

  ngOnInit() {
    this.spinnerLoading = true;
    this.ticketsService.getTickets();
    this.loggedInUserId = this.authService.getUserId();
    //update users on change
    this.ticketsSubscription = this.ticketsService.getTicketsUpdateListener().subscribe(
      (ticketsChanged: Ticket[]) => {
        this.spinnerLoading = false;
        this.tickets = ticketsChanged;
      }
    );
    this.userIsAuthenticated = this.authService.getUserIsAuth();
    this.authStatusSubscription = this.authService.getAuthStatusListener().subscribe(
      isAuthenticated => {
        this.userIsAuthenticated = isAuthenticated;
        this.loggedInUserId = this.authService.getUserId();
      }
    );
  }

  onDelete(ticketId: string){
    this.ticketsService.deleteTicket(ticketId);
  }

  ngOnDestroy(): void {
    this.ticketsSubscription.unsubscribe();
    this.authStatusSubscription.unsubscribe();
  }

}
