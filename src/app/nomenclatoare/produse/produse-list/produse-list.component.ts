import { HttpResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { produseDTO } from '../produse-item/produse.model';
import { ProduseService } from '../produse.service';

@Component({
  selector: 'app-produse-list',
  templateUrl: './produse-list.component.html',
  styleUrls: ['./produse-list.component.scss']
})
export class ProduseListComponent implements OnInit {

  produse: produseDTO[];
  constructor(private produseService: ProduseService) {  
    this.produse = [];
  }
  
  columnsToDisplay= ['cod', 'nume', 'um', 'action'];

  ngOnInit(): void {    
    this.loadList();
  }

  loadList(){
    this.produseService.getAll().subscribe(produse=>{
      this.produse = produse;
      console.log(this.produse);
    });    
  }
  delete(id: number){
    this.produseService.delete(id)
    .subscribe(() => {
      this.loadList();
    });
  }

}
