import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material';

@Component({
  selector: 'app-error',
  templateUrl: './error.component.html',
  styleUrls: ['./error.component.scss']
})
export class ErrorComponent implements OnInit {
  ngOnInit(){

  }

  message = "An unknown error occured"

  //We use inject to identify data we pass, bcoz of the way error component is created
  constructor(@Inject(MAT_DIALOG_DATA) public data: {message: string}){}
}
