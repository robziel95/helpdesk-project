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

  addTicket(inputTicket: Ticket, uploadedFile: File = null){
    let ticketFormData = new FormData;
    for(var key in inputTicket){
      ticketFormData.append(key, inputTicket[key]);
    }
    ticketFormData.append("uploadedFile", uploadedFile);
    this.http.post<{message: string, ticketId: string}>('http://localhost:3000/api/tickets', ticketFormData)
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
              status: ticket.status,
              creationDate: ticket.creationDate,
              uploadedFilePath: ticket.uploadedFilePath
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
      creationDate: string;
      uploadedFilePath: string;
    }>('http://localhost:3000/api/tickets/' + id);
  }

  getTicketsUpdateListener(){
    return this.ticketsUpdated.asObservable();
  }

  updateTicket(inputTicket: Ticket, uploadedFile: File = null){
    let inputTicketFormData = new FormData;
    for(var key in inputTicket){
      inputTicketFormData.append(key, inputTicket[key]);
    }
    if(uploadedFile !== null){
      inputTicketFormData.set("uploadedFile", uploadedFile);
    }
    this.http.put('http://localhost:3000/api/tickets/' + inputTicket.id, inputTicketFormData).subscribe(
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
