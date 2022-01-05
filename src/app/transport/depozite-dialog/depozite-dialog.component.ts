import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, NgForm } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { RxwebValidators } from '@rxweb/reactive-form-validators';

@Component({
  selector: 'app-depozite-dialog',
  templateUrl: './depozite-dialog.component.html',
  styleUrls: ['./depozite-dialog.component.scss']
})
export class DepoziteDialogComponent implements OnInit {

  public form!: FormGroup;
  private id: number=0;
  private date: Date|null;
  private detalii: string='';
  constructor(private formBuilder:FormBuilder,
    @Inject(MAT_DIALOG_DATA) data: { id: number, date: Date|null, detalii: string },
    public dialogRef: MatDialogRef<DepoziteDialogComponent>) { 
      this.id = data?.id;
      this.date = data?.date == null ? new Date() : data.date;
      this.detalii = data?.detalii;
    }

  ngOnInit(): void {

    this.form = this.formBuilder.group({      
      id:this.id,
      data:[this.date, {validators:[RxwebValidators.required()]}],
      detalii: this.detalii,
    });    
  }

  submit(form: NgForm) {    
    this.dialogRef.close({
      clicked: 'submit',
      form: form      
    });
  }

}
