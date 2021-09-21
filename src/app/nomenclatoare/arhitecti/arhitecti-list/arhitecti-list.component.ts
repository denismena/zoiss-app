import { Component, OnInit } from '@angular/core';
import { arhitectiDTO } from '../arhitecti-item/arhitecti.model';
import { ArhitectiService } from '../arhitecti.service';

@Component({
  selector: 'app-arhitecti-list',
  templateUrl: './arhitecti-list.component.html',
  styleUrls: ['./arhitecti-list.component.scss']
})
export class ArhitectiListComponent implements OnInit {

  arhitecti: arhitectiDTO[];
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
      console.log(this.arhitecti);
    });    
  }
  delete(id: number){
    this.arhitectiService.delete(id)
    .subscribe(() => {
      this.loadList();
    });
  }

}
