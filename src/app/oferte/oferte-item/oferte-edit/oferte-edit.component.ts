import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { produseOfertaDTO } from 'src/app/nomenclatoare/produse/produse-item/produse.model';
import { OferteService } from '../../oferte.service';
import { oferteCreationDTO, oferteDTO } from '../oferte.model';

@Component({
  selector: 'app-oferte-edit',
  templateUrl: './oferte-edit.component.html',
  styleUrls: ['./oferte-edit.component.scss']
})
export class OferteEditComponent implements OnInit {

  constructor(private activatedRoute: ActivatedRoute,private router:Router, private oferteService: OferteService) { }
  
  model!:oferteDTO;
  selectedProdus: produseOfertaDTO[] = [];
  ngOnInit(): void {
    this.activatedRoute.params.subscribe(params => {
      this.oferteService.putGet(params.id).subscribe(oferta => {
        this.model = oferta.oferta;
        this.selectedProdus = oferta.produse;
        console.log(this.model);
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
