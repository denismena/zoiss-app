import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { parseWebAPIErrors } from 'src/app/utilities/utils';
import { TransporatorService } from '../../transportator.service';
import { transportatorDTO } from '../transportator.model';

@Component({
  selector: 'app-transportator-create',
  templateUrl: './transportator-create.component.html',
  styleUrls: ['./transportator-create.component.scss']
})
export class TransportatorCreateComponent implements OnInit {

  errors: string[] = [];
  constructor(private router:Router, private transporatorService: TransporatorService) { }

  ngOnInit(): void {
  }
  saveChanges(transportatorDTO: transportatorDTO){
    console.log(transportatorDTO);
    this.transporatorService.create(transportatorDTO).subscribe(()=>{
      this.router.navigate(['/transportator'])
    }, 
    error=> this.errors = parseWebAPIErrors(error));    
  }

}
