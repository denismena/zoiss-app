import { Component, OnInit } from '@angular/core';
import { umDTO } from '../um-item/um.model';
import { UMService } from '../um.service';

@Component({
  selector: 'app-um-list',
  templateUrl: './um-list.component.html',
  styleUrls: ['./um-list.component.scss']
})
export class UmListComponent implements OnInit {

  um: umDTO[] = [];
  columnsToDisplay= ['nume', 'action'];
  constructor(private umService: UMService) { }

  ngOnInit(): void {    
    this.loadList();
  }

  loadList(){
    this.umService.getAll().subscribe(um=>{
      this.um = um;
      console.log(this.um);
    });    
  }
  delete(id: number){
    this.umService.delete(id)
    .subscribe(() => {
      this.loadList();
    });
  }

}
