import { Component, OnInit } from '@angular/core';
import { parseWebAPIErrors } from 'src/app/utilities/utils';
import Swal from 'sweetalert2';
import { depoziteDTO } from '../depozite-item/depozite.model';
import { DepoziteService } from '../depozite.service';

@Component({
  selector: 'app-depozite-list',
  templateUrl: './depozite-list.component.html',
  styleUrls: ['./depozite-list.component.scss']
})
export class DepoziteListComponent implements OnInit {

  errors: string[] = [];
  depozite: depoziteDTO[];
  loading$: boolean = true;
  constructor(private depoziteService: DepoziteService) { 
    this.depozite = [];
  }

  columnsToDisplay= ['nume', 'adresa', 'persoanaContact', 'persoanaContactTel', 'persoanaContactEmail', 'sort', 'parent', 'active', 'action'];

  ngOnInit(): void {
    this.loadList();
  }
  loadList(){
    this.depoziteService.getAll().subscribe(depozit=>{
      this.depozite = depozit;
      this.loading$ = false;
    }, error => {
      this.errors = parseWebAPIErrors(error);      
      this.loading$ = false;
    });    
  }
  delete(id: number){
    this.depoziteService.delete(id)
    .subscribe(() => {
      this.loadList();
    }, error => {
      this.errors = parseWebAPIErrors(error);
      Swal.fire({ title: "A aparut o eroare!", text: error.error, icon: 'error' });
    });
  }

}
