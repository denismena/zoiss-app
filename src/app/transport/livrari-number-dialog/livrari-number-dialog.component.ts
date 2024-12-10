import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, NgForm } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { RxwebValidators } from '@rxweb/reactive-form-validators';
import { takeUntil } from 'rxjs/operators';
import { LivrariService } from 'src/app/livrari/livrari.service';
import { UnsubscribeService } from 'src/app/unsubscribe.service';

@Component({
    selector: 'app-livrari-number-dialog',
    templateUrl: './livrari-number-dialog.component.html',
    styleUrls: ['./livrari-number-dialog.component.scss'],
    standalone: false
})
export class LivrariNumberDialogComponent implements OnInit, OnDestroy {

  public form!: FormGroup;  
  constructor(private formBuilder:FormBuilder, private livrariService: LivrariService, private unsubscribeService: UnsubscribeService, 
    @Inject(MAT_DIALOG_DATA) data: { },
    public dialogRef: MatDialogRef<LivrariNumberDialogComponent>) {
    }    

  ngOnInit(): void {
    this.form = this.formBuilder.group({      
      numar:[null, {validators:[RxwebValidators.required()]}],      
    });    

    this.livrariService.getNextNumber()
    .pipe(takeUntil(this.unsubscribeService.unsubscribeSignal$))
    .subscribe(data=>{
      this.form.get('numar')?.setValue(data);
    });

  }

  submit(form: NgForm) {    
    this.dialogRef.close({
      clicked: 'submit',
      form: form      
    });
  }

  ngOnDestroy(): void {
  }
}
