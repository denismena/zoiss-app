import { Component, OnInit } from '@angular/core';
import { clientiDTO } from '../clienti-item/clienti.model';
import { ClientiService } from '../clienti.service';

@Component({
  selector: 'app-clienti-list',
  templateUrl: './clienti-list.component.html',
  styleUrls: ['./clienti-list.component.scss']
})
export class ClientiListComponent implements OnInit {

  clienti: clientiDTO[];
  constructor(private clientiService: ClientiService) { 
    this.clienti = [];
  }
  columnsToDisplay= ['nume', 'pfpj', 'cuicnp', 'registruComert', 'action'];
  ngOnInit(): void {
    this.loadList();
  }

  loadList(){
    this.clientiService.getAll().subscribe(clienti=>{
      this.clienti = clienti;
      console.log(this.clienti);
    });    
  }
  delete(id: number){
    this.clientiService.delete(id)
    .subscribe(() => {
      this.loadList();
    });
  }
}
