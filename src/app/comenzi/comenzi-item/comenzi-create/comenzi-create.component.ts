import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { parseWebAPIErrors } from 'src/app/utilities/utils';
import { ComenziService } from '../../comenzi.service';
import { comenziDTO } from '../comenzi.model';

@Component({
  selector: 'app-comenzi-create',
  templateUrl: './comenzi-create.component.html',
  styleUrls: ['./comenzi-create.component.scss']
})
export class ComenziCreateComponent implements OnInit {

  errors: string[] = [];
  constructor(private router:Router, private comenziService: ComenziService) { }

  nextNumber: number = 1;
  ngOnInit(): void {    
  }

  saveChanges(comenziDTO:comenziDTO){
    console.log(comenziDTO);
    this.comenziService.create(comenziDTO).subscribe(()=>{
      this.router.navigate(['/comenzi'])
    }, 
    error=> this.errors = parseWebAPIErrors(error));    
  }

}
