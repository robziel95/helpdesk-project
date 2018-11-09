import { Component, OnInit } from '@angular/core';
import { Ticket } from '../ticket.model';
import { TicketsService } from '../tickets.service';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/auth/auth.service';
import { PageEvent } from '@angular/material';
import { UsersService } from 'src/app/users/users.service';

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
  totalTickets = 0;
  postsPerPage = 5;
  currentPage = 1;
  pageSizeOptions = [5, 10, 20, 50, 100]
  private ticketsSubscription: Subscription;
  private authStatusSubscription: Subscription;


  constructor(public ticketsService: TicketsService,
    private authService: AuthService,
    private usersService: UsersService) { }

  ngOnInit() {
    this.spinnerLoading = true;
    this.ticketsService.getTickets(this.postsPerPage, this.currentPage);
    this.loggedInUserId = this.authService.getUserId();
    //update users on change
    this.ticketsSubscription = this.ticketsService.getTicketsUpdateListener().subscribe(
      (ticketsData: {tickets: Ticket[], ticketsCount: number}) => {
        this.spinnerLoading = false;
        this.tickets = ticketsData.tickets;
        this.totalTickets = ticketsData.ticketsCount;
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
    this.spinnerLoading = true;
    this.ticketsService.deleteTicket(ticketId).subscribe(
      () => {
        this.ticketsService.getTickets(this.postsPerPage, this.currentPage);
        this.usersService.openSnackbar.next('Ticket successfully deleted');
      }
    ), error => {
      this.usersService.openSnackbar.next('Ticket deletion failed');
    }
  }

  onChangedPage(pageData: PageEvent){
    this.spinnerLoading = true;
    this.currentPage = pageData.pageIndex + 1;//index starts with 0
    this.postsPerPage = pageData.pageSize;
    this.ticketsService.getTickets(this.postsPerPage, this.currentPage);
  }

  ngOnDestroy(): void {
    this.ticketsSubscription.unsubscribe();
    this.authStatusSubscription.unsubscribe();
  }

}
