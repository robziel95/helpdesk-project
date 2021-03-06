import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { NgForm } from '@angular/forms';
import { TicketsService } from '../tickets.service';
import { Ticket } from '../ticket.model';
import { Subscription } from 'rxjs';
import { UsersService } from 'src/app/users/users.service';

@Component({
  selector: 'app-ticket-submit',
  templateUrl: './ticket-submit.component.html',
  styleUrls: ['./ticket-submit.component.scss']
})
export class TicketSubmitComponent implements OnInit, OnDestroy {
  inputTicketData: Ticket;
  editedTicket: Ticket;
  mode = 'create';
  spinnerLoading = false;
  private ticketId: string;
  private errorThrownSubscription: Subscription;

  constructor(
    public ticketsService: TicketsService,
    public route: ActivatedRoute,
    public usersService: UsersService
  ) {}


  ngOnInit() {
    this.route.paramMap.subscribe(
      (paramMap: ParamMap) => {
        if (paramMap.has('ticketId')){
          this.mode = 'edit';
          this.ticketId = paramMap.get('ticketId');
          this.spinnerLoading = true;
          this.ticketsService.getTicket(this.ticketId).subscribe(ticketData => {
            this.spinnerLoading = false;
            this.editedTicket = {
              id: ticketData._id,
              title: ticketData.title,
              priority: ticketData.priority,
              description: ticketData.description,
              creator: ticketData.creator,
              status: ticketData.status,
              creationDate: ticketData.creationDate
            }
          });
        }else{
          this.mode = 'create';
          this.ticketId = null;
        }
      }
    );
    this.errorThrownSubscription = this.usersService.getErrorThrownListener().subscribe(
      errorThrown => {
        this.spinnerLoading = false;
      }
    );
  }

  onSaveTicket(form: NgForm){
    if (form.invalid){
      return;
    }
    this.inputTicketData = {
      id: null,
      title: form.value.title,
      priority: form.value.priority,
      description: form.value.description,
      creator: null,
      status: 'Unassigned',
      creationDate: new Date().toISOString().slice(0,10).replace(/-/g,'/')
    };
    console.log(this.inputTicketData.creationDate);
    this.spinnerLoading = true;
    if (this.mode === 'create'){
      this.ticketsService.addTicket(this.inputTicketData);
    }
    else{
      //update more fields on edit
      this.inputTicketData.id = this.ticketId;
      this.inputTicketData.status = form.value.status;
      this.inputTicketData.creator = this.editedTicket.creator;
      this.inputTicketData.creationDate = this.editedTicket.creationDate;
      this.ticketsService.updateTicket(this.inputTicketData);
    }
  }
  ngOnDestroy(){
    this.errorThrownSubscription.unsubscribe();
  }
}
