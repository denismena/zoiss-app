import { Component, OnInit } from '@angular/core';
import { parseWebAPIErrors } from 'src/app/utilities/utils';
import Swal from 'sweetalert2';
import { arhitectiDTO } from '../arhitecti-item/arhitecti.model';
import { ArhitectiService } from '../arhitecti.service';

@Component({
  selector: 'app-arhitecti-list',
  templateUrl: './arhitecti-list.component.html',
  styleUrls: ['./arhitecti-list.component.scss']
})
export class ArhitectiListComponent implements OnInit {

  arhitecti: arhitectiDTO[];
  errors: string[] = [];
  loading$: boolean = true;
  constructor(private arhitectiService: ArhitectiService) { 
    this.arhitecti = [];
  }

  columnsToDisplay= ['nume', 'adresa', 'tel', 'email', 'comision', 'action'];

  ngOnInit(): void {
    this.loadList();
  }
  loadList(){
    this.arhitectiService.getAll().subscribe(arhitecti=>{
      this.arhitecti = arhitecti;
      this.loading$ = false;
    }, error => {
      this.errors = parseWebAPIErrors(error);      
      this.loading$ = false;
    });    
  }
  delete(id: number){
    this.arhitectiService.delete(id)
    .subscribe(() => {
      this.loadList();
    }, error => {
      this.errors = parseWebAPIErrors(error);
      Swal.fire({ title: "A aparut o eroare!", text: error.error, icon: 'error' });
    });
  }

}
