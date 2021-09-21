import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { parseWebAPIErrors } from 'src/app/utilities/utils';
import { ArhitectiService } from '../../arhitecti.service';
import { arhitectiDTO } from '../arhitecti.model';

@Component({
  selector: 'app-arhitecti-create',
  templateUrl: './arhitecti-create.component.html',
  styleUrls: ['./arhitecti-create.component.scss']
})
export class ArhitectiCreateComponent implements OnInit {

  errors: string[] = [];
  constructor(private router:Router, private arhitectiService: ArhitectiService) { }

  ngOnInit(): void {
  }
  saveChanges(arhitectiDTO: arhitectiDTO){
    console.log(arhitectiDTO);
    this.arhitectiService.create(arhitectiDTO).subscribe(()=>{
      this.router.navigate(['/arhitecti'])
    }, 
    error=> this.errors = parseWebAPIErrors(error));    
  }

}
