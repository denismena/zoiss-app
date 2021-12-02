import { Component, OnInit } from '@angular/core';
import { parseWebAPIErrors } from 'src/app/utilities/utils';
import Swal from 'sweetalert2';
import { transportatorDTO } from '../transportator-item/transportator.model';
import { TransporatorService } from '../transportator.service';

@Component({
  selector: 'app-transportator-list',
  templateUrl: './transportator-list.component.html',
  styleUrls: ['./transportator-list.component.scss']
})
export class TransportatorListComponent implements OnInit {

  transportator: transportatorDTO[];
  errors: string[] = [];
  constructor(private transporatorService: TransporatorService) { 
    this.transportator = [];
  }

  columnsToDisplay= ['nume', 'nrInmatriculare', 'adresa', 'tel', 'email', 'active', 'action'];

  ngOnInit(): void {
    this.loadList();
  }
  loadList(){
    this.transporatorService.getAll().subscribe(transportator=>{
      this.transportator = transportator;
      console.log(this.transportator);
    });    
  }
  delete(id: number){
    this.transporatorService.delete(id)
    .subscribe(() => {
      this.loadList();
    }, error => {
      this.errors = parseWebAPIErrors(error);
      Swal.fire({ title: "A aparut o eroare!", text: error.error, icon: 'error' });
    });
  }

}
