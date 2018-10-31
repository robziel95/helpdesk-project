import { Component, OnInit } from '@angular/core';
import { Ticket } from '../ticket.model';
import { TicketsService } from '../tickets.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-ticket-list',
  templateUrl: './ticket-list.component.html',
  styleUrls: ['./ticket-list.component.scss']
})
export class TicketListComponent implements OnInit {

  tickets: Ticket [] = [];
  spinnerLoading = false;
  private ticketsSubscription: Subscription;

  constructor(public ticketsService: TicketsService) { }

  ngOnInit() {
    this.spinnerLoading = true;
    this.ticketsService.getTickets();

    //update users on change
    this.ticketsSubscription = this.ticketsService.getTicketsUpdateListener().subscribe(
      (ticketsChanged: Ticket[]) => {
        this.spinnerLoading = false;
        this.tickets = ticketsChanged;
      }
    )
  }

  onDelete(postId: string){
    this.ticketsService.deleteTicket(postId);
  }

  ngOnDestroy(): void {
    this.ticketsSubscription.unsubscribe();
  }

}
