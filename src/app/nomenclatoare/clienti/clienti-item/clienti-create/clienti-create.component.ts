import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { parseWebAPIErrors } from 'src/app/utilities/utils';
import { ClientiService } from '../../clienti.service';
import { clientiDTO } from '../clienti.model';

@Component({
  selector: 'app-clienti-create',
  templateUrl: './clienti-create.component.html',
  styleUrls: ['./clienti-create.component.scss']
})
export class ClientiCreateComponent implements OnInit {

  errors: string[] = [];
  constructor(private router:Router, private clientiService: ClientiService) { }

  ngOnInit(): void {
  }
  saveChanges(clientiDTO:clientiDTO){
    console.log(clientiDTO);    
    this.clientiService.create(clientiDTO).subscribe(()=>{
      this.router.navigate(['/clienti'])
    }, 
    error=> this.errors = parseWebAPIErrors(error));    
  }
}
