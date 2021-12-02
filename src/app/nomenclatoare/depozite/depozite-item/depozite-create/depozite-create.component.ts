import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { parseWebAPIErrors } from 'src/app/utilities/utils';
import { DepoziteService } from '../../depozite.service';
import { depoziteDTO } from '../depozite.model';

@Component({
  selector: 'app-depozite-create',
  templateUrl: './depozite-create.component.html',
  styleUrls: ['./depozite-create.component.scss']
})
export class DepoziteCreateComponent implements OnInit {

  errors: string[] = [];
  constructor(private router:Router, private depoziteService: DepoziteService) { }

  ngOnInit(): void {
  }

  saveChanges(depoziteDTO: depoziteDTO){
    console.log(depoziteDTO);
    this.depoziteService.create(depoziteDTO).subscribe(()=>{
      this.router.navigate(['/depozite'])
    }, 
    error=> this.errors = parseWebAPIErrors(error));    
  }

}
