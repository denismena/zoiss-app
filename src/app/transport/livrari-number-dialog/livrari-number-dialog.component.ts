import { Component, Inject, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, NgForm } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { RxwebValidators } from '@rxweb/reactive-form-validators';

@Component({
  selector: 'app-livrari-number-dialog',
  templateUrl: './livrari-number-dialog.component.html',
  styleUrls: ['./livrari-number-dialog.component.scss']
})
export class LivrariNumberDialogComponent implements OnInit {

  public form!: UntypedFormGroup;  
  constructor(private formBuilder:UntypedFormBuilder,
    @Inject(MAT_DIALOG_DATA) data: { },
    public dialogRef: MatDialogRef<LivrariNumberDialogComponent>) {
    }    

  ngOnInit(): void {
    this.form = this.formBuilder.group({      
      numar:[null, {validators:[RxwebValidators.required()]}],      
    });    
  }

  submit(form: NgForm) {    
    this.dialogRef.close({
      clicked: 'submit',
      form: form      
    });
  }
}
