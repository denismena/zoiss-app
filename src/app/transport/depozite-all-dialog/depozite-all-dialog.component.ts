import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, NgForm } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { RxwebValidators } from '@rxweb/reactive-form-validators';

@Component({
    selector: 'app-depozite-all-dialog',
    templateUrl: './depozite-all-dialog.component.html',
    styleUrls: ['./depozite-all-dialog.component.scss'],
    standalone: false
})
export class DepoziteAllDialogComponent implements OnInit {

  public form!: FormGroup;
  private transportId: number=0;
  //private date: Date|null;
  private depozit: string='';
  constructor(private formBuilder:FormBuilder,
    @Inject(MAT_DIALOG_DATA) data: { id: number, depozit: string },
    public dialogRef: MatDialogRef<DepoziteAllDialogComponent>) { 
      this.transportId = data?.id;      
      this.depozit = data?.depozit;
    }

  ngOnInit(): void {
    this.form = this.formBuilder.group({      
      transportId:this.transportId,
      depozit: this.depozit,
      data:[new Date, {validators:[RxwebValidators.required()]}],
      detalii: null,
      overwriteAll: false 
    });    
  }

  submit(form: NgForm) {    
    this.dialogRef.close({
      clicked: 'submit',
      form: form      
    });
  }
  
  delete(form: NgForm) {    
    this.dialogRef.close({
      clicked: 'delete',
      form: form      
    });
  }
}
