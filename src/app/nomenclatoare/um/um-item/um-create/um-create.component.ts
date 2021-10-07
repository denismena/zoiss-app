import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { parseWebAPIErrors } from 'src/app/utilities/utils';
import { UMService } from '../../um.service';
import { umCreationDTO } from '../um.model';

@Component({
  selector: 'app-um-create',
  templateUrl: './um-create.component.html',
  styleUrls: ['./um-create.component.scss']
})
export class UmCreateComponent implements OnInit {

  errors: string[] = [];
  constructor(private router:Router, private umService: UMService) { }

  ngOnInit(): void {
  }
  saveChanges(umCreationDTO: umCreationDTO){
    console.log(umCreationDTO);
    this.umService.create(umCreationDTO).subscribe(()=>{
      this.router.navigate(['/um'])
    }, 
    error=> this.errors = parseWebAPIErrors(error));    
  }

}
