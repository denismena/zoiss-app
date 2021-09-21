import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { parseWebAPIErrors } from 'src/app/utilities/utils';
import { OferteService } from '../../oferte.service';
import { oferteDTO } from '../oferte.model';

@Component({
  selector: 'app-oferte-create',
  templateUrl: './oferte-create.component.html',
  styleUrls: ['./oferte-create.component.scss']
})
export class OferteCreateComponent implements OnInit {

  errors: string[] = [];
  constructor(private router:Router, private oferteService: OferteService) { }

  nextNumber: number = 1;
  ngOnInit(): void {
    this.oferteService.getNextNumber().subscribe(data=>{
      this.nextNumber = data;
    });
  }

  saveChanges(oferteDTO:oferteDTO){
    console.log(oferteDTO);
    this.oferteService.create(oferteDTO).subscribe(()=>{
      this.router.navigate(['/oferte'])
    }, 
    error=> this.errors = parseWebAPIErrors(error));    
  }

}
