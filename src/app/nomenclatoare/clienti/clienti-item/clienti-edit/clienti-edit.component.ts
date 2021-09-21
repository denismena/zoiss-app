import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ClientiService } from '../../clienti.service';
import { clientiDTO, clientiCreationDTO } from '../clienti.model';

@Component({
  selector: 'app-clienti-edit',
  templateUrl: './clienti-edit.component.html',
  styleUrls: ['./clienti-edit.component.scss']
})
export class ClientiEditComponent implements OnInit {

  constructor(private activatedRoute: ActivatedRoute,private router:Router, private clientiService: ClientiService) { }

  model!:clientiDTO;
  //model:clientiDTO = { nume:'ion', pf_pj: 1, cui_cnp: '21323432', registruComert:'dsadsa', active: true}
  ngOnInit(): void {
    this.activatedRoute.params.subscribe(params => {
      this.clientiService.getById(params.id).subscribe(client => {
        this.model = client;
        console.log(this.model);
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
