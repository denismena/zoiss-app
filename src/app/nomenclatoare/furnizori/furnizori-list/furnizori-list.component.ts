import { Component, OnInit } from '@angular/core';
import { furnizoriDTO } from '../furnizori-item/furnizori.model';
import { FurnizoriService } from '../furnizori.service';

@Component({
  selector: 'app-furnizori-list',
  templateUrl: './furnizori-list.component.html',
  styleUrls: ['./furnizori-list.component.scss']
})
export class FurnizoriListComponent implements OnInit {

  furnizori: furnizoriDTO[];
  constructor(private furnizoriService: FurnizoriService) { 
    this.furnizori = [];
  }

  columnsToDisplay= ['nume', 'tara', 'adresa', 'tel', 'email', 'action'];

  ngOnInit(): void {
    this.loadList();
  }
  loadList(){
    this.furnizoriService.getAll().subscribe(furnizori=>{
      this.furnizori = furnizori;
      console.log(this.furnizori);
    });    
  }
  delete(id: number){
    this.furnizoriService.delete(id)
    .subscribe(() => {
      this.loadList();
    });
  }
}
