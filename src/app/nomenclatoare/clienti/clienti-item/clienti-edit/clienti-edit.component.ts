import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { parseWebAPIErrors } from 'src/app/utilities/utils';
import { ClientiService } from '../../clienti.service';
import { clientiDTO, clientiCreationDTO, clientiAdresaDTO } from '../clienti.model';

@Component({
  selector: 'app-clienti-edit',
  templateUrl: './clienti-edit.component.html',
  styleUrls: ['./clienti-edit.component.scss']
})
export class ClientiEditComponent implements OnInit {

  constructor(private activatedRoute: ActivatedRoute,private router:Router, private clientiService: ClientiService) { }

  adreseList: clientiAdresaDTO[] = [];
  model!:clientiDTO;
  errors: string[] = [];
  //model:clientiDTO = { nume:'ion', pf_pj: 1, cui_cnp: '21323432', registruComert:'dsadsa', active: true}
  ngOnInit(): void {
    this.activatedRoute.params.subscribe(params => {
      this.clientiService.putGet(params.id).subscribe(client => {
        this.model = client.client;
        this.adreseList = client.adrese;
        console.log('edit', this.model);
      }, error => {
        console.log('error: ',error);
        this.errors = parseWebAPIErrors(error);      
        //this.loading$ = false;
      })
    });
  }
  saveChanges(clientiCreationDTO:clientiCreationDTO){
    console.log('edit to:', clientiCreationDTO);
    this.clientiService.edit(this.model.id, clientiCreationDTO)
    .subscribe(() => {
      this.router.navigate(["/clienti"]);
    });
  }
}
