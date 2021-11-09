import { Component, OnInit } from '@angular/core';
import { UtilizatoriDTO } from 'src/app/security/security.models';
import { SecurityService } from 'src/app/security/security.service';
import { parseWebAPIErrors } from 'src/app/utilities/utils';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-utilizatori-list',
  templateUrl: './utilizatori-list.component.html',
  styleUrls: ['./utilizatori-list.component.scss']
})
export class UtilizatoriListComponent implements OnInit {

  utilizatori: UtilizatoriDTO[];
  errors: string[] = [];
  constructor(private securitySevice: SecurityService) { 
    this.utilizatori = [];
  }
  columnsToDisplay= ['nume', 'email', 'tel', 'action'];
  ngOnInit(): void {
    this.loadList();
  }
  loadList(){
    this.securitySevice.getUsers().subscribe(utilizatori=>{
      this.utilizatori = utilizatori;
      console.log(this.utilizatori);
    });    
  }
  delete(id: string){
    this.securitySevice.markAsInactive(id)
    .subscribe(() => {
      this.loadList();
    }, error => {
      this.errors = parseWebAPIErrors(error);
      Swal.fire({ title: "A aparut o eroare!", text: error.error, icon: 'error' });
    });
  }
}
