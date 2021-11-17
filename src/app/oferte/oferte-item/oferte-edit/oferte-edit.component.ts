import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { arhitectiDTO } from 'src/app/nomenclatoare/arhitecti/arhitecti-item/arhitecti.model';
import { ArhitectiService } from 'src/app/nomenclatoare/arhitecti/arhitecti.service';
import { clientiDTO } from 'src/app/nomenclatoare/clienti/clienti-item/clienti.model';
import { ClientiService } from 'src/app/nomenclatoare/clienti/clienti.service';
import { produseOfertaDTO } from 'src/app/nomenclatoare/produse/produse-item/produse.model';
import { OferteService } from '../../oferte.service';
import { oferteCreationDTO, oferteDTO } from '../oferte.model';

@Component({
  selector: 'app-oferte-edit',
  templateUrl: './oferte-edit.component.html',
  styleUrls: ['./oferte-edit.component.scss']
})
export class OferteEditComponent implements OnInit {

  constructor(private activatedRoute: ActivatedRoute,private router:Router, 
    private oferteService: OferteService, private clientiService: ClientiService, private arhitectService: ArhitectiService) { }
  
  model!:oferteDTO;
  selectedProdus: produseOfertaDTO[] = [];
  preselectClient: clientiDTO | undefined;
  preselectArhitect: arhitectiDTO | undefined;

  ngOnInit(): void {
    this.activatedRoute.params.subscribe(params => {
      this.oferteService.putGet(params.id).subscribe(oferta => {
        this.model = oferta.oferta;
        this.selectedProdus = oferta.produse;
        console.log(this.model);

        this.clientiService.getById(oferta.oferta.clientId).subscribe(client=>{
          this.preselectClient = client;
        });

        if(oferta.oferta.arhitectId != null){
          this.arhitectService.getById(oferta.oferta.arhitectId).subscribe(arhitect=>{
            this.preselectArhitect = arhitect;
          });
        }
      })
    });
  }

  saveChanges(oferteCreationDTO:oferteCreationDTO){
    this.oferteService.edit(this.model.id, oferteCreationDTO)
    .subscribe(() => {
      this.router.navigate(["/oferte"]);
    });
  }

}
