import { Component, OnInit, OnDestroy, AfterViewInit } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { NgForm, FormGroup, FormControl, Validators } from '@angular/forms';
import { TicketsService } from '../tickets.service';
import { Ticket } from '../ticket.model';
import { Subscription } from 'rxjs';
import { UsersService } from 'src/app/users/users.service';
import { mimeTypeFile } from '../../validators/validate-ticket-file-mime.validator'

@Component({
  selector: 'app-ticket-submit',
  templateUrl: './ticket-submit.component.html',
  styleUrls: ['./ticket-submit.component.scss']
})
export class TicketSubmitComponent implements OnInit, OnDestroy {
  inputTicketData: Ticket;
  editedTicket: Ticket;
  form: FormGroup;
  mode = 'create';
  spinnerLoading = false;
  testdiv: string = "";
  filePath: string = "";
  private ticketId: string;
  private errorThrownSubscription: Subscription;

  constructor(
    public ticketsService: TicketsService,
    public route: ActivatedRoute,
    public usersService: UsersService
  ) {}


  ngOnInit() {
    this.form = new FormGroup({
      title: new FormControl(null, {validators: [Validators.required]}),
      priority: new FormControl(null, {validators: [Validators.required]}),
      status: new FormControl(null),
      description: new FormControl(null, {validators: [Validators.required]}),
      uploadedFile: new FormControl(null, Validators.nullValidator, [mimeTypeFile]),
    });

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
              creationDate: ticketData.creationDate,
              uploadedFilePath: null,
              uploadedFileName: ticketData.uploadedFileName || null,
            };
            this.filePath = this.editedTicket.uploadedFilePath;
            this.form.setValue({
              title: ticketData.title,
              priority: ticketData.priority,
              status: ticketData.status,
              description: ticketData.description,
              uploadedFile: null
            });
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

    // this.form.valueChanges.subscribe(val => {
    //   console.log(val);
    // })
  }

  onSaveTicket(){
    if (this.form.invalid){
      return;
    }
    this.inputTicketData = {
      id: null,
      title: this.form.value.title,
      priority: this.form.value.priority,
      description: this.form.value.description,
      creator: null,
      status: 'Unassigned',
      creationDate: new Date().toISOString().slice(0,10).replace(/-/g,'/'),
      uploadedFilePath: null,
      uploadedFileName: null
    };
    let uploadedFile = this.form.value.uploadedFile;
    this.spinnerLoading = true;
    if (this.mode === 'create'){
      this.ticketsService.addTicket(this.inputTicketData, uploadedFile);
    }
    else{
      //update more fields on edit
      this.inputTicketData.id = this.ticketId;
      this.inputTicketData.status = this.form.value.status;
      this.inputTicketData.creator = this.editedTicket.creator;
      this.inputTicketData.creationDate = this.editedTicket.creationDate;
      this.inputTicketData.uploadedFilePath = this.editedTicket.uploadedFilePath;
      this.inputTicketData.uploadedFileName = this.editedTicket.uploadedFileName;
      this.ticketsService.updateTicket(this.inputTicketData, uploadedFile);
    }
  }

  divInputChanged(input: any){
    typeof(input);
  }

  onFileChanged(event: Event){
    const file = (event.target as HTMLInputElement).files[0];
    this.form.patchValue({uploadedFile: file});
    this.form.get('uploadedFile').updateValueAndValidity();
    //create reader
    const reader = new FileReader();
    //init reader
    reader.onload = () => {
      //execute after reading
      //this.filePath = <string>reader.result;
    };
    //start reader (read 'file')
    reader.readAsDataURL(file);
  }

  ngOnDestroy(){
    this.errorThrownSubscription.unsubscribe();
  }
}
