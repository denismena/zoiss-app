import { Component, DestroyRef, inject, Inject, OnInit } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormBuilder, FormGroup, NgForm } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { RxwebValidators } from '@rxweb/reactive-form-validators';
import { LivrariService } from 'src/app/livrari/livrari.service';

@Component({
    selector: 'app-livrari-number-dialog',
    templateUrl: './livrari-number-dialog.component.html',
    styleUrls: ['./livrari-number-dialog.component.scss'],
    standalone: false
})
export class LivrariNumberDialogComponent implements OnInit {

  public form!: FormGroup;  
  private destroyRef = inject(DestroyRef);
  constructor(private formBuilder:FormBuilder, private livrariService: LivrariService, 
    @Inject(MAT_DIALOG_DATA) data: { },
    public dialogRef: MatDialogRef<LivrariNumberDialogComponent>) {
    }    

  ngOnInit(): void {
    this.form = this.formBuilder.group({      
      numar:[null, {validators:[RxwebValidators.required()]}],      
    });    

    this.livrariService.getNextNumber()
    .pipe(takeUntilDestroyed(this.destroyRef))
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

}
