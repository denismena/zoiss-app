import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { parseWebAPIErrors } from 'src/app/utilities/utils';
import { ClientiService } from '../../clienti.service';
import { clientiCreationDTO } from '../clienti.model';

@Component({
  selector: 'app-clienti-create-dialog',
  templateUrl: './clienti-create-dialog.component.html',
  styleUrls: ['./clienti-create-dialog.component.scss']
})
export class ClientiCreateDialogComponent implements OnInit {

  errors: string[] = [];
  isDialog: boolean = true;
  constructor(private clientiService: ClientiService,    
    public dialogRef: MatDialogRef<ClientiCreateDialogComponent>) { }

  ngOnInit(): void {
  }

  saveChanges(clientiDTO: clientiCreationDTO){
    if(clientiDTO != undefined)    {
    this.clientiService.create(clientiDTO).subscribe(id=>{
      this.dialogRef.close({
        clicked: 'submit',
        form: clientiDTO,
        id: id
      });
    }, 
    error=> this.errors = parseWebAPIErrors(error));    
  }else {
    this.dialogRef.close({
      clicked: 'cancel',
      form: clientiDTO,
      id: 0
    });
   }
  }

}
