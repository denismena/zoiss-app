import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatTable } from '@angular/material/table';
import { LivrariDTO, livrariProduseDTO } from '../livrari-item/livrari.model';
import { ProdusStocDialogComponent } from '../produs-stoc-dialog/produs-stoc-dialog.component';

@Component({
  selector: 'app-livrari-produse',
  templateUrl: './livrari-produse.component.html',
  styleUrls: ['./livrari-produse.component.scss']
})
export class LivrariProduseComponent implements OnInit {
  
  @Input() selectedProdus: livrariProduseDTO[]=[];
  checked = [];  
  @ViewChild(MatTable)
  table!: MatTable<any>;
  
  constructor(public dialog: MatDialog) { }
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
    var livrariId = this.selectedProdus[0].livrariId;
    const dialogRef = this.dialog.open(ProdusStocDialogComponent,      
      { data:{id: livrariId}, width: '650px', height: '300px' });

      dialogRef.afterClosed().subscribe((data) => {
        if (data.clicked === 'submit') {
          console.log('data.form: ', data.form);
          const anotherLivrareProdus : livrariProduseDTO = {
            produsNume: data.form.produsNume,
            um: data.form.um,
            cantitate: data.form.cantitate,
            cutii: data.form.cutii,

            id: 0,
            livrariId: 0,
            transportProduseId: null,
            comenziProdusId: data.form.id,
            furnizor: '',
            livrat: false
          }
          this.selectedProdus.push(anotherLivrareProdus);
          
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

}
