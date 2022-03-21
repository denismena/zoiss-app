import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { parseWebAPIErrors } from 'src/app/utilities/utils';
import { ProduseService } from '../../produse.service';
import { produseCreationDTO, produseDTO } from '../produse.model';

@Component({
  selector: 'app-produse-create-dialog',
  templateUrl: './produse-create-dialog.component.html',
  styleUrls: ['./produse-create-dialog.component.scss']
})
export class ProduseCreateDialogComponent implements OnInit {

  errors: string[] = [];
  isDialog: boolean = true;
  preselectedProdus: produseCreationDTO;
  editId: number = 0;  
  constructor(private router:Router, private produsService: ProduseService,
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
        this.produsService.create(produseDTO).subscribe(id=>{      
          console.log('id:', id);
          this.dialogRef.close({
            clicked: 'submit',
            form: produseDTO,
            id: id
          });    
          //console.log('produsService.create subscribe');
        }, 
        error=> this.errors = parseWebAPIErrors(error));    
      }
      else{
        this.produsService.edit(this.editId, produseDTO).subscribe(id=>{      
          console.log('id:', id);
          this.dialogRef.close({
            clicked: 'submit',
            form: produseDTO,
            id: this.editId
          });    
          //console.log('produsService.create subscribe');
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
