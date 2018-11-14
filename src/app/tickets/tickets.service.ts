import { Injectable } from '@angular/core';
import { Ticket } from './ticket.model';
import { Subject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { map } from 'rxjs/operators';
import { SharedService } from '../shared/shared.service';

@Injectable({
  providedIn: 'root'
})
export class TicketsService {
  private tickets: Ticket [] = [];
  private ticketsUpdated = new Subject<{tickets: Ticket[], ticketsCount: number}>();

  constructor(private http: HttpClient, private router: Router, private sharedService: SharedService) { }

  addTicket(inputTicket: Ticket){
    const newTicket: Ticket = inputTicket;
    this.http.post<{message: string, ticketId: string}>('http://localhost:3000/api/tickets', newTicket)
    .subscribe(
      (responseData) => {
        this.router.navigate(['/tickets']);
      }
    );
  }

  getTickets(ticketsPerPage: number, currentPage: number){
    //queryParams for backend paginator management
    const queryParams = `?pagesize=${ticketsPerPage}&page=${currentPage}`;
    this.http.get<{message: string, tickets: any, maxTickets: number}>('http://localhost:3000/api/tickets' + queryParams)
    //pipe changes _id into id
    .pipe(map(
      (ticketData) => {
        return { tickets: ticketData.tickets.map(ticket => {
            return{
              id: ticket._id,
              title: ticket.title,
              priority: ticket.priority,
              description: ticket.description,
              creator: ticket.creator,
              status: ticket.status
            };
          }), maxTickets: ticketData.maxTickets
        };

      }
    ))
    .subscribe(
      //update transformed data after map
      (transformedTicketData) => {
        this.tickets = transformedTicketData.tickets;
        this.ticketsUpdated.next({
          tickets: [...this.tickets], ticketsCount: transformedTicketData.maxTickets
        });
        //return by copy
      }
    );
  }

  getTicket(id: string){
    return this.http.get<{
      _id: string;
      title: string;
      priority: string;
      description: string;
      creator: string;
      status: string;
    }>('http://localhost:3000/api/tickets/' + id);
  }

  getTicketsUpdateListener(){
    return this.ticketsUpdated.asObservable();
  }

  updateTicket(inputTicket: Ticket){
    const ticketToUpdate: Ticket = {
      id: inputTicket.id,
      title: inputTicket.title,
      priority: inputTicket.priority,
      description: inputTicket.description,
      creator: inputTicket.creator,
      status: inputTicket.status
    };
    this.http.put('http://localhost:3000/api/tickets/' + ticketToUpdate.id, ticketToUpdate).subscribe(
      (response) => {
        this.router.navigate(['/tickets']);
        this.sharedService.openSnackbar.next('Ticket successfully updated');
      }
    ), error => {
      this.sharedService.openSnackbar.next('Ticket update failed');
    }
  }

  deleteTicket(ticketId: string){
    return this.http.delete('http://localhost:3000/api/tickets/' + ticketId);
  }
}
