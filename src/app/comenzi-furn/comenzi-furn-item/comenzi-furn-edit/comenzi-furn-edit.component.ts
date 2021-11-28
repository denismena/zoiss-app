import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ComenziFurnizorService } from '../../comenzi-furn.service';
import { comenziFurnizorCreationDTO, comenziFurnizorDTO, produseComandaFurnizorDTO } from '../comenzi-furn.model';

@Component({
  selector: 'app-comenzi-furn-edit',
  templateUrl: './comenzi-furn-edit.component.html',
  styleUrls: ['./comenzi-furn-edit.component.scss']
})
export class ComenziFurnEditComponent implements OnInit {
  
  
  constructor(private activatedRoute: ActivatedRoute,private router:Router, private comenziFurnizorService: ComenziFurnizorService) { }
  model!:comenziFurnizorDTO;
  selectedProdus: produseComandaFurnizorDTO[] = [];
  ngOnInit(): void {

    this.activatedRoute.params.subscribe(params => {
      this.comenziFurnizorService.putGet(params.id).subscribe(comanda => {
        console.log('comanda:', comanda);
        this.model = comanda.comandaFurnizor;
        this.selectedProdus = comanda.comenziFurnizoriProduse;
        console.log('comenzi edit model', this.model);
        console.log('comenzi edit model selectedProdus', this.selectedProdus);        
      })
    });
  }

  saveChanges(comenziFurnizorCreationDTO:comenziFurnizorCreationDTO){
    this.comenziFurnizorService.edit(this.model.id, comenziFurnizorCreationDTO)
    .subscribe(() => {
      this.router.navigate(["/comenziFurnizor"]);
    });
  }

}
