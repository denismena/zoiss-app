import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { parseWebAPIErrors } from 'src/app/utilities/utils';
import { ClientiService } from '../../clienti.service';
import { clientiAdresaDTO, clientiCreationDTO, clientiDTO } from '../clienti.model';

@Component({
  selector: 'app-clienti-create-dialog',
  templateUrl: './clienti-create-dialog.component.html',
  styleUrls: ['./clienti-create-dialog.component.scss']
})
export class ClientiCreateDialogComponent implements OnInit {

  errors: string[] = [];
  isDialog: boolean = true;
  preselectClient: clientiDTO | undefined;
  adreseList: clientiAdresaDTO[] = [];
  editId: number = 0;  
  constructor(private clientiService: ClientiService,
    @Inject(MAT_DIALOG_DATA) data:{client: clientiDTO, editId: number},    
    public dialogRef: MatDialogRef<ClientiCreateDialogComponent>) { 
      this.editId = data?.editId;
      if(this.editId > 0){
        this.preselectClient = data?.client;
        this.adreseList = data?.client.adrese;
      }      
    }

  ngOnInit(): void {
  }

  saveChanges(clientiDTO: clientiCreationDTO){
    if(clientiDTO != undefined){
      if(this.editId == 0){
        this.clientiService.create(clientiDTO).subscribe(id=>{
          this.dialogRef.close({
            clicked: 'submit',
            form: clientiDTO,
            id: id
          });
        }, 
        error=> this.errors = parseWebAPIErrors(error));
      }
      else{
        this.clientiService.edit(this.editId, clientiDTO).subscribe(id=>{
          this.dialogRef.close({
            clicked: 'submit',
            form: clientiDTO,
            id: this.editId
          });
        }, 
        error=> this.errors = parseWebAPIErrors(error));
      }
    }else {
      this.dialogRef.close({
        clicked: 'cancel',
        form: clientiDTO,
        id: 0
      });
    }
  }

}
