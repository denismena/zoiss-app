import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { parseWebAPIErrors } from 'src/app/utilities/utils';
import { FurnizoriService } from '../../furnizori.service';
import { furnizoriCreationDTO, furnizoriDTO } from '../furnizori.model';

@Component({
  selector: 'app-furnizori-create-dialog',
  templateUrl: './furnizori-create-dialog.component.html',
  styleUrls: ['./furnizori-create-dialog.component.scss']
})
export class FurnizoriCreateDialogComponent implements OnInit {
  errors: string[] = [];
  isDialog: boolean = true;
  preselectedFurnizor: furnizoriDTO;
  editId: number = 0;  
  constructor(private furnizoriService: FurnizoriService,
    @Inject(MAT_DIALOG_DATA) data:{furnizor: furnizoriDTO, editId:number},
    public dialogRef: MatDialogRef<FurnizoriCreateDialogComponent>) { 
      this.preselectedFurnizor = data?.furnizor;
      this.editId = data?.editId;
    }

  ngOnInit(): void {
  }

  saveChanges(furnizoriDTO: furnizoriCreationDTO){
  if(furnizoriDTO!=undefined){
    if(this.editId == 0)
    {
      this.furnizoriService.create(furnizoriDTO).subscribe(id=>{
        this.dialogRef.close({
          clicked: 'submit',
          form: furnizoriDTO,
          id: id
        });
      }, 
      error=> this.errors = parseWebAPIErrors(error));
    }
    else{
      this.furnizoriService.edit(this.editId, furnizoriDTO).subscribe(id=>{
        this.dialogRef.close({
          clicked: 'submit',
          form: furnizoriDTO,
          id: this.editId
        });
      }, 
      error=> this.errors = parseWebAPIErrors(error)); 
    }
  }else {
    this.dialogRef.close({
      clicked: 'cancel',
      form: furnizoriDTO,
      id: 0
    });
   }
  }
}
