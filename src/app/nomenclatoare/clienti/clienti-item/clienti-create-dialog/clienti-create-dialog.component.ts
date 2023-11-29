import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { parseWebAPIErrors } from 'src/app/utilities/utils';
import { ClientiService } from '../../clienti.service';
import { clientiAdresaDTO, clientiCreationDTO, clientiDTO } from '../clienti.model';
import { UnsubscribeService } from 'src/app/unsubscribe.service';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-clienti-create-dialog',
  templateUrl: './clienti-create-dialog.component.html',
  styleUrls: ['./clienti-create-dialog.component.scss']
})
export class ClientiCreateDialogComponent implements OnInit, OnDestroy {

  errors: string[] = [];
  isDialog: boolean = true;
  preselectClient: clientiDTO | undefined;
  adreseList: clientiAdresaDTO[] = [];
  editId: number = 0;  
  constructor(private clientiService: ClientiService, private unsubscribeService: UnsubscribeService,
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
        this.clientiService.create(clientiDTO)
        .pipe(takeUntil(this.unsubscribeService.unsubscribeSignal$))
        .subscribe(id=>{
          this.dialogRef.close({
            clicked: 'submit',
            form: clientiDTO,
            id: id
          });
        }, 
        error=> this.errors = parseWebAPIErrors(error));
      }
      else{
        this.clientiService.edit(this.editId, clientiDTO)
        .pipe(takeUntil(this.unsubscribeService.unsubscribeSignal$))
        .subscribe(id=>{
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

  ngOnDestroy(): void {}

}
