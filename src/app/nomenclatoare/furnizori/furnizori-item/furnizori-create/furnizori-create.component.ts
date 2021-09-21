import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { parseWebAPIErrors } from 'src/app/utilities/utils';
import { FurnizoriService } from '../../furnizori.service';
import { furnizoriDTO } from '../furnizori.model';

@Component({
  selector: 'app-furnizori-create',
  templateUrl: './furnizori-create.component.html',
  styleUrls: ['./furnizori-create.component.scss']
})
export class FurnizoriCreateComponent implements OnInit {
  errors: string[] = [];
  constructor(private router:Router, private furnizoriService: FurnizoriService) { }

  ngOnInit(): void {
  }
  saveChanges(furnizoriDTO: furnizoriDTO){
    console.log(furnizoriDTO);
    this.furnizoriService.create(furnizoriDTO).subscribe(()=>{
      this.router.navigate(['/furnizori'])
    }, 
    error=> this.errors = parseWebAPIErrors(error));    
  }

}
