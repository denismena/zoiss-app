import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, NgForm } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { NumericValueType, RxwebValidators } from '@rxweb/reactive-form-validators';
import { produseComandaFurnizorDTO } from '../comenzi-furn-item/comenzi-furn.model';

@Component({
  selector: 'app-produs-split-dialog',
  templateUrl: './produs-split-dialog.component.html',
  styleUrls: ['./produs-split-dialog.component.scss']
})
export class ProdusSplitDialogComponent implements OnInit {

  public form!: FormGroup;
  produsSplit: produseComandaFurnizorDTO;
  protected nouaValoareCantiate: number=0;
  protected nouaValoareCutii: number=0;
  constructor(private formBuilder:FormBuilder, 
    @Inject(MAT_DIALOG_DATA) data: { produsSplit: produseComandaFurnizorDTO },
    public dialogRef: MatDialogRef<ProdusSplitDialogComponent>) { 
    this.produsSplit = data?.produsSplit;
  }

  ngOnInit(): void {
    this.form = this.formBuilder.group({
      cutii:[this.produsSplit.cutii, {validators:[RxwebValidators.numeric({acceptValue:NumericValueType.PositiveNumber, allowDecimal:false }),
                                    RxwebValidators.lessThan({value: this.produsSplit.cutii }),
                                    RxwebValidators.greaterThan({value: 0 }),
                                    RxwebValidators.required
                                  ]}],
    })
    this.nouaValoareCantiate = this.produsSplit.cantitate;
  }

  submit(form: NgForm) {   
    const anotherProdus : produseComandaFurnizorDTO = {
      ...this.produsSplit,
      cutii:  Number(this.form.get('cutii')?.value),
      cantitate: this.nouaValoareCantiate,
      valoare: this.produsSplit.valoare * this.nouaValoareCutii / this.produsSplit.cutii
    }
    this.dialogRef.close({
      clicked: 'submit',
      form: anotherProdus
    });
  }

  onCutiiChange(event: any){
    this.nouaValoareCutii = Number(event.target.value??0);
    this.nouaValoareCantiate = this.produsSplit.cantitate * this.nouaValoareCutii / this.produsSplit.cutii;
  }
}
