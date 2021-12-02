import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TransporatorService } from '../../transportator.service';
import { transportatorCreationDTO, transportatorDTO } from '../transportator.model';

@Component({
  selector: 'app-transportator-edit',
  templateUrl: './transportator-edit.component.html',
  styleUrls: ['./transportator-edit.component.scss']
})
export class TransportatorEditComponent implements OnInit {

  constructor(private activatedRoute: ActivatedRoute,private router:Router, 
    private transporatorService: TransporatorService) { }

  model!:transportatorDTO;
  ngOnInit(): void {
    this.activatedRoute.params.subscribe(params => {
      this.transporatorService.getById(params.id).subscribe(transportator => {
        this.model = transportator;
        console.log(this.model);
      })
    });
  }
  saveChanges(transportatorCreationDTO:transportatorCreationDTO){
    this.transporatorService.edit(this.model.id, transportatorCreationDTO)
    .subscribe(() => {
      this.router.navigate(["/transportator"]);
    });
  }

}
