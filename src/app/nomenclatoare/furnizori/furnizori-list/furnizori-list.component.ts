import { Component, OnInit } from '@angular/core';
import { parseWebAPIErrors } from 'src/app/utilities/utils';
import Swal from 'sweetalert2';
import { furnizoriDTO } from '../furnizori-item/furnizori.model';
import { FurnizoriService } from '../furnizori.service';

@Component({
  selector: 'app-furnizori-list',
  templateUrl: './furnizori-list.component.html',
  styleUrls: ['./furnizori-list.component.scss']
})
export class FurnizoriListComponent implements OnInit {

  furnizori: furnizoriDTO[];
  errors: string[] = [];
  loading$: boolean = true;
  constructor(private furnizoriService: FurnizoriService) { 
    this.furnizori = [];
  }

  columnsToDisplay= ['nume', 'oras', 'judet', 'tara', 'adresa', 'tel', 'email', 'action'];

  ngOnInit(): void {
    this.loadList();
  }
  loadList(){
    this.furnizoriService.getAll().subscribe(furnizori=>{
      this.furnizori = furnizori;
      this.loading$ = false;
      console.log(this.furnizori);
    });    
  }
  delete(id: number){
    this.furnizoriService.delete(id)
    .subscribe(() => {
      this.loadList();
    }, error => {
      this.errors = parseWebAPIErrors(error);
      Swal.fire({ title: "A aparut o eroare!", text: error.error, icon: 'error' });
    });
  }
}
