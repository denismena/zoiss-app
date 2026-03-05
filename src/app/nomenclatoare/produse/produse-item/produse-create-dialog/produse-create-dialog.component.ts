import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { parseWebAPIErrors } from 'src/app/utilities/utils';
import { ProduseService } from '../../produse.service';
import { produseCreationDTO, produseDTO } from '../produse.model';
import { DestroyRef, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
    selector: 'app-produse-create-dialog',
    templateUrl: './produse-create-dialog.component.html',
    styleUrls: ['./produse-create-dialog.component.scss'],
    standalone: false
})
export class ProduseCreateDialogComponent implements OnInit {

  errors: string[] = [];
  isDialog: boolean = true;
  preselectedProdus: produseCreationDTO;
  editId: number = 0;
  private destroyRef = inject(DestroyRef);
  constructor(private produsService: ProduseService,
    @Inject(MAT_DIALOG_DATA) data:{produs: produseDTO, editId:number},
    public dialogRef: MatDialogRef<ProduseCreateDialogComponent>) { 
      this.preselectedProdus = data?.produs;
      this.editId = data?.editId;      
    }

  ngOnInit(): void {
    //console.log('dialogRef', this.dialogRef);    
  }
  saveChanges(produseDTO: produseCreationDTO){    
    if(produseDTO != undefined){
      if(this.editId == 0){
        this.produsService.create(produseDTO)
        .pipe(takeUntilDestroyed(this.destroyRef))
        .subscribe(id=>{      
          this.dialogRef.close({
            clicked: 'submit',
            form: produseDTO,
            id: id
          });    
        }, 
        error=> this.errors = parseWebAPIErrors(error));    
      }
      else{
        this.produsService.edit(this.editId, produseDTO)
        .pipe(takeUntilDestroyed(this.destroyRef))
        .subscribe(id=>{      
          this.dialogRef.close({
            clicked: 'submit',
            form: produseDTO,
            id: this.editId
          });    
        }, 
        error=> this.errors = parseWebAPIErrors(error));  
      }
    }
    else {
      this.dialogRef.close({
        clicked: 'cancel',
        form: produseDTO,
        id: 0
      });
    }
  }
}
