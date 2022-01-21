import { HttpResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { parseWebAPIErrors } from 'src/app/utilities/utils';
import Swal from 'sweetalert2';
import { produseDTO } from '../produse-item/produse.model';
import { ProduseService } from '../produse.service';

@Component({
  selector: 'app-produse-list',
  templateUrl: './produse-list.component.html',
  styleUrls: ['./produse-list.component.scss']
})
export class ProduseListComponent implements OnInit {

  produse: produseDTO[];
  errors: string[] = [];
  loading$: boolean = true;
  constructor(private produseService: ProduseService) {  
    this.produse = [];
  }
  
  columnsToDisplay= ['cod', 'nume', 'perCutie', 'pret', 'um', 'action'];

  ngOnInit(): void {    
    this.loadList();
  }

  loadList(){
    this.produseService.getAll().subscribe(produse=>{
      this.produse = produse;
      console.log(this.produse);
      this.loading$ = false;
    });    
  }
  delete(id: number){
    this.produseService.delete(id)
    .subscribe(() => {
      this.loadList();
    }, error => {
      this.errors = parseWebAPIErrors(error);
      Swal.fire({ title: "A aparut o eroare!", text: error.error, icon: 'error' });
    });
  }

}
