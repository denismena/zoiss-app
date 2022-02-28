import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { parseWebAPIErrors } from 'src/app/utilities/utils';
import { FurnizoriService } from '../../furnizori.service';
import { furnizoriCreationDTO } from '../furnizori.model';

@Component({
  selector: 'app-furnizori-create-dialog',
  templateUrl: './furnizori-create-dialog.component.html',
  styleUrls: ['./furnizori-create-dialog.component.scss']
})
export class FurnizoriCreateDialogComponent implements OnInit {
  errors: string[] = [];
  isDialog: boolean = true;
  constructor(private furnizoriService: FurnizoriService,public dialogRef: MatDialogRef<FurnizoriCreateDialogComponent>) { }

  ngOnInit(): void {
  }

  saveChanges(furnizoriDTO: furnizoriCreationDTO){
    if(furnizoriDTO!=undefined){
    this.furnizoriService.create(furnizoriDTO).subscribe(id=>{
      this.dialogRef.close({
        clicked: 'submit',
        form: furnizoriDTO,
        id: id
      });
    }, 
    error=> this.errors = parseWebAPIErrors(error));    
  }else {
    this.dialogRef.close({
      clicked: 'cancel',
      form: furnizoriDTO,
      id: 0
    });
   }
  }
}
