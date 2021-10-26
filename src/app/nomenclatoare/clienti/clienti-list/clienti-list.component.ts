import { Component, OnInit } from '@angular/core';
import { parseWebAPIErrors } from 'src/app/utilities/utils';
import Swal from 'sweetalert2';
import { clientiDTO } from '../clienti-item/clienti.model';
import { ClientiService } from '../clienti.service';

@Component({
  selector: 'app-clienti-list',
  templateUrl: './clienti-list.component.html',
  styleUrls: ['./clienti-list.component.scss']
})
export class ClientiListComponent implements OnInit {

  clienti: clientiDTO[];
  errors: string[] = [];
  constructor(private clientiService: ClientiService) { 
    this.clienti = [];
  }
  columnsToDisplay= ['nume', 'pfPj', 'cuicnp', 'registruComert', 'action'];
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
    }, error => {
      this.errors = parseWebAPIErrors(error);
      Swal.fire({ title: "A aparut o eroare!", text: error.error, icon: 'error' });
    });
  }
}
