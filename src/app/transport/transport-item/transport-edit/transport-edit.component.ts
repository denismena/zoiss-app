import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { depoziteDTO } from 'src/app/nomenclatoare/depozite/depozite-item/depozite.model';
import { TransportService } from '../../transport.service';
import { transportCreationDTO, transportDTO, transportEditDTO, transportProduseDTO } from '../transport.model';

@Component({
  selector: 'app-transport-edit',
  templateUrl: './transport-edit.component.html',
  styleUrls: ['./transport-edit.component.scss']
})
export class TransportEditComponent implements OnInit {

  constructor(private activatedRoute: ActivatedRoute,private router:Router, private transportService: TransportService) { }
  model!:transportDTO;
  selectedProdus: transportProduseDTO[] = [];
  depoziteLista: string[]=[];
  ngOnInit(): void {

    this.activatedRoute.params.subscribe(params => {
      this.transportService.putGet(params.id).subscribe(transport => {
        this.model = transport.transport;
        this.selectedProdus = transport.transportProduse;
        transport.depoziteLista.forEach(d=>{
          this.depoziteLista.push(d.nume);
        })
      })
    });
  }

  saveChanges(transportCreationDTO:transportEditDTO){
    this.transportService.edit(this.model.id, transportCreationDTO)
    .subscribe(() => {
      this.router.navigate(["/transport"]);
    });
  }

}
