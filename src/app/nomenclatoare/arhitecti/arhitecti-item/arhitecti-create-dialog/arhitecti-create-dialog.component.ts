import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { parseWebAPIErrors } from 'src/app/utilities/utils';
import { ArhitectiService } from '../../arhitecti.service';
import { arhitectiCreationDTO, arhitectiDTO } from '../arhitecti.model';
import { DestroyRef, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
    selector: 'app-arhitecti-create-dialog',
    templateUrl: './arhitecti-create-dialog.component.html',
    styleUrls: ['./arhitecti-create-dialog.component.scss'],
    standalone: false
})
export class ArhitectiCreateDialogComponent implements OnInit {
  errors: string[] = [];
  isDialog: boolean = true;
  editId: number = 0;
  preselectedArhitect: arhitectiDTO;
  private destroyRef = inject(DestroyRef);
  constructor(private arhitectiService: ArhitectiService,
    @Inject(MAT_DIALOG_DATA) data:{arhitect: arhitectiDTO, editId:number}, 
    public dialogRef: MatDialogRef<ArhitectiCreateDialogComponent>) { 
      this.preselectedArhitect = data?.arhitect;
      this.editId = data?.editId;
    }

  ngOnInit(): void {
  }

  saveChanges(arhitectDTO: arhitectiCreationDTO){
  if(arhitectDTO!=undefined){
    if(this.editId == 0){
      this.arhitectiService.create(arhitectDTO)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(id=>{
        this.dialogRef.close({
          clicked: 'submit',
          form: arhitectDTO,
          id: id
        });
      }, 
      error=> this.errors = parseWebAPIErrors(error));    
    }
    else{
      this.arhitectiService.edit(this.editId, arhitectDTO)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(id=>{
        this.dialogRef.close({
          clicked: 'submit',
          form: arhitectDTO,
          id: this.editId
        });
      }, 
      error=> this.errors = parseWebAPIErrors(error));
    }
  }else {
    this.dialogRef.close({
      clicked: 'cancel',
      form: arhitectDTO,
      id: 0
    });
   }
  }
}
