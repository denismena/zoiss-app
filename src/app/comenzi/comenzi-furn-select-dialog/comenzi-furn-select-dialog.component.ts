import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, NgForm } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
//import { MatLegacyDialogRef as MatDialogRef, MAT_LEGACY_DIALOG_DATA as MAT_DIALOG_DATA } from '@angular/material/legacy-dialog';
import { RxwebValidators } from '@rxweb/reactive-form-validators';
import { takeUntil } from 'rxjs/operators';
import { comenziFurnizorBasicDTO } from 'src/app/comenzi-furn/comenzi-furn-item/comenzi-furn.model';
import { ComenziFurnizorService } from 'src/app/comenzi-furn/comenzi-furn.service';
import { UnsubscribeService } from 'src/app/unsubscribe.service';

@Component({
  selector: 'app-comenzi-furn-select-dialog',
  templateUrl: './comenzi-furn-select-dialog.component.html',
  styleUrls: ['./comenzi-furn-select-dialog.component.scss']
})
export class ComenziFurnSelectDialogComponent implements OnInit, OnDestroy {

  public form!: FormGroup;
  comenzifurnizor: comenziFurnizorBasicDTO[];
  furnizorId:number;
  constructor(private formBuilder:FormBuilder, private comenziFurnizorService: ComenziFurnizorService, private unsubscribeService: UnsubscribeService,
    @Inject(MAT_DIALOG_DATA) data: { furnizorId:number}, public dialogRef: MatDialogRef<ComenziFurnSelectDialogComponent>) {
      this.comenzifurnizor = [];
      this.furnizorId = data.furnizorId;
    } 

  ngOnInit(): void {
    this.form = this.formBuilder.group({      
      comandaFurnId:[null, {validators:[RxwebValidators.required()]}],      
    });    
   
    this.comenziFurnizorService.getBasicList(this.furnizorId)
    .pipe(takeUntil(this.unsubscribeService.unsubscribeSignal$))
    .subscribe(data=>{      
      this.comenzifurnizor=data;
    });
  }

  submit(form: NgForm) {        
    this.dialogRef.close({
      clicked: 'submit',
      form: form      
    });
  }

  ngOnDestroy(): void {}

}
