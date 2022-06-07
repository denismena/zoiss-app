import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { parseWebAPIErrors } from 'src/app/utilities/utils';
import { SucursaleService } from '../../sucursala.service';
import { sucursalaCreationDTO } from '../sucursala.model';

@Component({
  selector: 'app-sucursale-create',
  templateUrl: './sucursale-create.component.html',
  styleUrls: ['./sucursale-create.component.scss']
})
export class SucursaleCreateComponent implements OnInit {

  errors: string[] = [];
  constructor(private router:Router, private sucursaleService: SucursaleService) { }

  ngOnInit(): void {
  }
  saveChanges(sucursalaCreationDTO: sucursalaCreationDTO){
    this.sucursaleService.create(sucursalaCreationDTO).subscribe(()=>{
      this.router.navigate(['/sucursale'])
    }, 
    error=> this.errors = parseWebAPIErrors(error));    
  }
}
