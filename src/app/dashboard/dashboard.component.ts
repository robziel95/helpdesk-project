import { Component, OnInit, OnDestroy } from '@angular/core';
import { UsersService } from '../users/users.service';
import { User } from '../users/user.model';
import { Subscription } from 'rxjs';
import { Ticket } from '../tickets/ticket.model';
import { TicketsService } from '../tickets/tickets.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit, OnDestroy {
  users: User[] = [];
  tickets: Ticket[] = [];
  usersCount: Number = 0;
  ticketsCount: Number = 0;
  resolvedTicketsCount: Number = 0;


  private usersSubscription: Subscription;
  private ticketsSubscription: Subscription;

  constructor(private usersService: UsersService, private ticketsService: TicketsService) { }

  ngOnInit() {
    this.usersService.getUsers();
    this.usersSubscription = this.usersService.getUsersUpdateListener().subscribe(
      (usersChanged: User[]) => {
        this.users = usersChanged;
        this.usersCount = this.users.length;
      }
    );
    this.ticketsService.getTickets();
    this.ticketsSubscription = this.ticketsService.getTicketsUpdateListener().subscribe(
      (ticketsChanged: Ticket[]) => {
        let countResolvedTickets = 0;

        this.tickets = ticketsChanged;
        this.ticketsCount = this.tickets.length;
        for (let ticket of this.tickets){
          if(ticket.status === 'Resolved'){
            countResolvedTickets++;
          }
        }
        this.resolvedTicketsCount = countResolvedTickets;
      }
    );
  }

  ngOnDestroy(){
    this.usersSubscription.unsubscribe();
    this.ticketsSubscription.unsubscribe();
  }
}
