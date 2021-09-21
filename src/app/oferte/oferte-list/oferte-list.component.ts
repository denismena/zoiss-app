import { Component, OnInit } from '@angular/core';
import { oferteDTO } from '../oferte-item/oferte.model';
import { OferteService } from '../oferte.service';

@Component({
  selector: 'app-oferte-list',
  templateUrl: './oferte-list.component.html',
  styleUrls: ['./oferte-list.component.scss']
})
export class OferteListComponent implements OnInit {

  oferte: oferteDTO[]
  constructor(private oferteService: OferteService) { 
    this.oferte = [];
  }
  columnsToDisplay= ['numar', 'data', 'client', 'arhitect', 'utilizator', 'avans', 'action'];
  
  ngOnInit(): void {
    this.loadList();
  }

  loadList(){
    this.oferteService.getAll().subscribe(oferte=>{
      this.oferte = oferte;
      console.log(this.oferte);
    });    
  }
  delete(id: number){
    this.oferteService.delete(id)
    .subscribe(() => {
      this.loadList();
    });
  }

}
