import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, NgForm, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { takeUntil } from 'rxjs/operators';
import { comandaStocDTO, comandaStocProduseDTO } from 'src/app/comenzi/comenzi-item/comenzi.model';
import { ComenziService } from 'src/app/comenzi/comenzi.service';
import { UnsubscribeService } from 'src/app/unsubscribe.service';

@Component({
  selector: 'app-produs-stoc-dialog',
  templateUrl: './produs-stoc-dialog.component.html',
  styleUrls: ['./produs-stoc-dialog.component.scss']
})
export class ProdusStocDialogComponent implements OnInit, OnDestroy {

  public form!: FormGroup;
  produseStocList: comandaStocDTO[] =[];
  filteredProduseStocList: comandaStocDTO[] =[];
  searchTextProdus: string = '';
  searchTextComanda: string = '';
  clientId: number = 0;
  constructor(private formBuilder:FormBuilder, private comenziService: ComenziService, private unsubscribeService: UnsubscribeService,
    @Inject(MAT_DIALOG_DATA) data: { id: number },
    public dialogRef: MatDialogRef<ProdusStocDialogComponent>) {
      this.clientId = data.id; 
  }

  ngOnInit(): void {
    this.form = this.formBuilder.group({
      comandaProdusId:[null, {validators:[Validators.required]}],
    })
    
    this.comenziService.produseStoc(this.clientId)
    .pipe(takeUntil(this.unsubscribeService.unsubscribeSignal$))
    .subscribe(produseStoc=>{
      this.filteredProduseStocList = this.produseStocList = produseStoc;
      //console.log('this.produseStocList:', this.produseStocList);      
    });
  }  

  updateSearchResults(): void {
    this.filteredProduseStocList = this.produseStocList.filter((comanda) => {
      const filteredComenziProduse = comanda.comenziProduseStoc.filter((produs) => {
        const searchRegex = new RegExp(this.searchTextProdus, 'i');
        return searchRegex.test(produs.produsNume) || searchRegex.test(produs.codProdus);
      });
      return filteredComenziProduse.length > 0;
    });
  }

  filterComenziProduseStoc(comenziProduseStoc: comandaStocProduseDTO[], searchText: string): comandaStocProduseDTO[] {
    if (!searchText) {
      return comenziProduseStoc;
    }
    searchText = searchText.toLowerCase();
    return comenziProduseStoc.filter((produs: comandaStocProduseDTO) => {
      return produs.produsNume.toLowerCase().includes(searchText) || produs.codProdus.toLowerCase().includes(searchText);
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

  ngOnDestroy(): void {}

}
