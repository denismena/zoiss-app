import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { clientiDTO } from 'src/app/nomenclatoare/clienti/clienti-item/clienti.model';
import { ClientiService } from 'src/app/nomenclatoare/clienti/clienti.service';
import { LivrariService } from '../../livrari.service';
import { LivrariDTO, livrariProduseDTO } from '../livrari.model';

@Component({
  selector: 'app-livrari-edit',
  templateUrl: './livrari-edit.component.html',
  styleUrls: ['./livrari-edit.component.scss']
})
export class LivrariEditComponent implements OnInit {

  constructor(private activatedRoute: ActivatedRoute,private router:Router, private clientiService: ClientiService,
    private livrareService: LivrariService) { }
  model!:LivrariDTO;
  selectedProdus: livrariProduseDTO[] = [];
  preselectClient: clientiDTO | undefined;
  ngOnInit(): void {
    this.activatedRoute.params.subscribe(params => {
      this.livrareService.putGet(params.id).subscribe(livrare => {
        this.model = livrare.livrare;        
        this.selectedProdus = livrare.livrareProduse;
        
        this.clientiService.getById(livrare.livrare.clientId).subscribe(client=>{
          this.preselectClient = client;
        });        
      })
    });
  }

  saveChanges(livrariDTO:LivrariDTO){
    this.livrareService.edit(this.model.id, livrariDTO)
    .subscribe(() => {
      this.router.navigate(["/livrari"]);
    });
  }

}
