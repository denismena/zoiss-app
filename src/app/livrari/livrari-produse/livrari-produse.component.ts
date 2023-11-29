import { Component, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatTable } from '@angular/material/table';
import { LivrariDTO, livrariProduseDTO } from '../livrari-item/livrari.model';
import { ProdusStocDialogComponent } from '../produs-stoc-dialog/produs-stoc-dialog.component';
import { UnsubscribeService } from 'src/app/unsubscribe.service';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-livrari-produse',
  templateUrl: './livrari-produse.component.html',
  styleUrls: ['./livrari-produse.component.scss']
})
export class LivrariProduseComponent implements OnInit, OnDestroy {
  
  @Input() selectedProdus: livrariProduseDTO[]=[];
  @Input() clientId: number | undefined;
  checked = [];  
  @ViewChild(MatTable)
  table!: MatTable<any>;
  
  constructor(public dialog: MatDialog, private unsubscribeService: UnsubscribeService) { }
  columnsToDisplay = ['furnizor', 'produsNume', 'cantitate', 'um', 'cutii', 'livrat', 'actions']
  ngOnInit(): void {    
  }

  getCheckbox(checkbox: any){
    this.checked = [];    
    this.selectedProdus.forEach(p=>p.livrat = checkbox.checked
    );    
  }

  isAllSelected(row: LivrariDTO) {
    console.log(row);
    row.allLivrare = this.selectedProdus.every(function(item:any) {
          return item.livrat == true;
    })
  }

  produsStocPrompt(){
    //var clientId = this.selectedProdus[0].clientId;
    const dialogRef = this.dialog.open(ProdusStocDialogComponent,      
      { data:{id: this.clientId}, width: '650px', height: '300px' });

      dialogRef.afterClosed()
      .pipe(takeUntil(this.unsubscribeService.unsubscribeSignal$))
      .subscribe((data) => {
        if (data.clicked === 'submit') {          
          data.form.forEach((produs: any) => {
            const anotherLivrareProdus : livrariProduseDTO = {
              produsNume: produs.produsNume,
              um: produs.um,
              cantitate: produs.cantitate,
              cutii: produs.cutii,
              clientId: this.clientId ?? 0,

              id: 0,
              livrariId: 0,
              transportProduseId: null,
              comenziProdusId: produs.id,
              furnizor: '',
              livrat: false
            }
            this.selectedProdus.push(anotherLivrareProdus);
          });     

          if (this.table !== undefined){      
            this.table.renderRows();
          }
        }
      });
  }

  remove(produs:any){
    const index = this.selectedProdus.findIndex(a => a.id === produs.id);
    this.selectedProdus.splice(index, 1);
    this.table.renderRows();
  }

  split(produs:any, splitCutii: any){
    console.log('splitCutii: ', splitCutii.value);
    console.log('delete produs: ', produs);

    const splitProdus : livrariProduseDTO = {
      ...produs,
      cutii: splitCutii.value,
      id: 0
    }
    
    //remove selected row
    var prodIndex = this.selectedProdus.findIndex(a=>a.id === produs.id);
    this.selectedProdus.splice(prodIndex,1);
    
    this.selectedProdus.push(splitProdus);
    produs.cutii -=splitCutii.value;
    this.selectedProdus.push(produs);
    if (this.table !== undefined){      
      this.table.renderRows();
      console.log('this.table: ', this.table);
    }    
  }

  ngOnDestroy(): void {}

}
