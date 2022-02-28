import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { parseWebAPIErrors } from 'src/app/utilities/utils';
import { ArhitectiService } from '../../arhitecti.service';
import { arhitectiCreationDTO } from '../arhitecti.model';

@Component({
  selector: 'app-arhitecti-create-dialog',
  templateUrl: './arhitecti-create-dialog.component.html',
  styleUrls: ['./arhitecti-create-dialog.component.scss']
})
export class ArhitectiCreateDialogComponent implements OnInit {
  errors: string[] = [];
  isDialog: boolean = true;
  constructor(private arhitectiService: ArhitectiService, public dialogRef: MatDialogRef<ArhitectiCreateDialogComponent>) { }

  ngOnInit(): void {
  }
  saveChanges(arhitectDTO: arhitectiCreationDTO){
    if(arhitectDTO!=undefined){
    this.arhitectiService.create(arhitectDTO).subscribe(id=>{
      this.dialogRef.close({
        clicked: 'submit',
        form: arhitectDTO,
        id: id
      });
    }, 
    error=> this.errors = parseWebAPIErrors(error));    
  }else {
    this.dialogRef.close({
      clicked: 'cancel',
      form: arhitectDTO,
      id: 0
    });
   }
  }
}
