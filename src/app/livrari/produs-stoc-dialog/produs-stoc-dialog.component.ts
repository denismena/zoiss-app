import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, NgForm, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { comandaStocDTO, comandaStocProduseDTO } from 'src/app/comenzi/comenzi-item/comenzi.model';
import { ComenziService } from 'src/app/comenzi/comenzi.service';

@Component({
  selector: 'app-produs-stoc-dialog',
  templateUrl: './produs-stoc-dialog.component.html',
  styleUrls: ['./produs-stoc-dialog.component.scss']
})
export class ProdusStocDialogComponent implements OnInit {

  public form!: FormGroup;
  produseStocList: comandaStocDTO[] =[];
  constructor(private formBuilder:FormBuilder, private comenziService: ComenziService, 
    @Inject(MAT_DIALOG_DATA) data: { id: number },
    public dialogRef: MatDialogRef<ProdusStocDialogComponent>) { 
  }

  ngOnInit(): void {
    this.form = this.formBuilder.group({
      comandaProdusId:[null, {validators:[Validators.required]}],
    })
    
    this.comenziService.produseStoc().subscribe(produseStoc=>{
      this.produseStocList=produseStoc;
      console.log('this.produseStocList:', this.produseStocList);      
    });
  }  

  submit(form: NgForm) {    
    const selectedProdusList : comandaStocProduseDTO[] = [];
    const selectedValues = this.form.get('comandaProdusId')?.value;
    selectedValues.forEach((comandaProdusId: number) => {
      this.produseStocList.forEach(produs => {
        produs.comenziProduseStoc.forEach(comandaProdus => {
          if(comandaProdus.id == comandaProdusId){
            const selectedProdus : comandaStocProduseDTO = {
              ...comandaProdus
            }
            selectedProdusList.push(selectedProdus);
          }
        });        
      });
    });
    this.dialogRef.close({
      clicked: 'submit',
      form: selectedProdusList
    });
  }

}
