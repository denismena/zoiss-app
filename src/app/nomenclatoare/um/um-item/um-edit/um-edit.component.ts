import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UMService } from '../../um.service';
import { umCreationDTO, umDTO } from '../um.model';

@Component({
  selector: 'app-um-edit',
  templateUrl: './um-edit.component.html',
  styleUrls: ['./um-edit.component.scss']
})
export class UmEditComponent implements OnInit {

  constructor(private activatedRoute: ActivatedRoute,private router:Router, private umService: UMService) { }

  model!:umDTO;
  ngOnInit(): void {
    this.activatedRoute.params.subscribe(params => {
      this.umService.getById(params.id).subscribe(um => {
        this.model = um;
        console.log(this.model);
      })
    });
  }
  saveChanges(umCreationDTO:umCreationDTO){
    this.umService.edit(this.model.id, umCreationDTO)
    .subscribe(() => {
      this.router.navigate(["/um"]);
    });
  }

}
