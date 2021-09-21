import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { parseWebAPIErrors } from 'src/app/utilities/utils';
import { ProduseService } from '../../produse.service';
import { produseCreationDTO } from '../produse.model';

@Component({
  selector: 'app-produse-create',
  templateUrl: './produse-create.component.html',
  styleUrls: ['./produse-create.component.scss']
})
export class ProduseCreateComponent implements OnInit {

  errors: string[] = [];
  constructor(private router:Router, private produsService: ProduseService) { }

  ngOnInit(): void {
  }
  saveChanges(produseDTO: produseCreationDTO){
    console.log(produseDTO);
    this.produsService.create(produseDTO).subscribe(()=>{
      this.router.navigate(['/produse'])
    }, 
    error=> this.errors = parseWebAPIErrors(error));    
  }
}
