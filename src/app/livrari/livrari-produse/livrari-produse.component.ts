import { Component, Input, OnInit } from '@angular/core';
import { LivrariDTO, livrariProduseDTO } from '../livrari-item/livrari.model';

@Component({
  selector: 'app-livrari-produse',
  templateUrl: './livrari-produse.component.html',
  styleUrls: ['./livrari-produse.component.scss']
})
export class LivrariProduseComponent implements OnInit {

  @Input() selectedProdus: livrariProduseDTO[]=[];
  checked = [];

  constructor() { }
  columnsToDisplay = ['furnizor', 'produsNume', 'cantitate', 'um', 'cutii', 'livrat']
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

}
