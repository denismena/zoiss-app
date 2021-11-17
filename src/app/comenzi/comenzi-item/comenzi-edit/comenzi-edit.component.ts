import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { arhitectiDTO } from 'src/app/nomenclatoare/arhitecti/arhitecti-item/arhitecti.model';
import { ArhitectiService } from 'src/app/nomenclatoare/arhitecti/arhitecti.service';
import { clientiDTO } from 'src/app/nomenclatoare/clienti/clienti-item/clienti.model';
import { ClientiService } from 'src/app/nomenclatoare/clienti/clienti.service';
import { ComenziService } from '../../comenzi.service';
import { comenziCreationDTO, comenziDTO, produseComandaDTO } from '../comenzi.model';

@Component({
  selector: 'app-comenzi-edit',
  templateUrl: './comenzi-edit.component.html',
  styleUrls: ['./comenzi-edit.component.scss']
})
export class ComenziEditComponent implements OnInit {

  constructor(private activatedRoute: ActivatedRoute,private router:Router, 
    private comenziService: ComenziService, private clientiService: ClientiService, private arhitectService: ArhitectiService) { }
  
  model!:comenziDTO;
  selectedProdus: produseComandaDTO[] = [];
  preselectClient: clientiDTO | undefined;
  preselectArhitect: arhitectiDTO | undefined;

  ngOnInit(): void {
    this.activatedRoute.params.subscribe(params => {
      this.comenziService.putGet(params.id).subscribe(comanda => {
        this.model = comanda.comanda;
        this.selectedProdus = comanda.comenziProduses;
        console.log('comenzi edit model prod', this.model);

        this.clientiService.getById(comanda.comanda.clientId).subscribe(client=>{
          this.preselectClient = client;
        });
        if(comanda.comanda.arhitectId != null){
          this.arhitectService.getById(comanda.comanda.arhitectId).subscribe(arhitect=>{
            this.preselectArhitect = arhitect;
          });
        }
      })
    });
  }

  saveChanges(comenziCreationDTO:comenziCreationDTO){
    this.comenziService.edit(this.model.id, comenziCreationDTO)
    .subscribe(() => {
      this.router.navigate(["/comenzi"]);
    });
  }
}
