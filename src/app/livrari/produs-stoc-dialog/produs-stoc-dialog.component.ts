import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, NgForm, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { produseStocComandaDTO } from 'src/app/comenzi/comenzi-item/comenzi.model';
import { ComenziService } from 'src/app/comenzi/comenzi.service';

@Component({
  selector: 'app-produs-stoc-dialog',
  templateUrl: './produs-stoc-dialog.component.html',
  styleUrls: ['./produs-stoc-dialog.component.scss']
})
export class ProdusStocDialogComponent implements OnInit {

  public form!: FormGroup;
  produseStocList: produseStocComandaDTO[] =[];
  //private selectedProdusCantitate: number= 99;
  constructor(private formBuilder:FormBuilder, private comenziService: ComenziService, 
    @Inject(MAT_DIALOG_DATA) data: { id: number },
    public dialogRef: MatDialogRef<ProdusStocDialogComponent>) { 
    //this.id = data?.id;    
  }

  ngOnInit(): void {
    this.form = this.formBuilder.group({
      comandaProdusId:[null, {validators:[Validators.required]}],
      //cantitate:[null, {validators:[Validators.required, Validators.max(this.selectedProdusCantitate)]}],      
    })
    
    this.comenziService.produseStoc().subscribe(produseStoc=>{
      this.produseStocList=produseStoc;      
    })
  }
  onchange(produs:any){
    var prodIndex = this.produseStocList.findIndex(a=>a.id == produs.value); 
    //this.selectedProdusCantitate = this.produseStocList[prodIndex].cantitate;
    // this.form.get('cantitate')?.setValidators([Validators.required, Validators.max(this.selectedProdusCantitate)])
    // this.form.get('cantitate')?.updateValueAndValidity();    
  }
  submit(form: NgForm) {   
    var prodIndex = this.produseStocList.findIndex(a=>a.id === Number(this.form.get('comandaProdusId')?.value)); 
    const selectedProdus : produseStocComandaDTO = {
      ...this.produseStocList[prodIndex]  ,
      //cantitate:  Number(this.form.get('cantitate')?.value),
    }
    this.dialogRef.close({
      clicked: 'submit',
      form: selectedProdus
    });
  }

}
