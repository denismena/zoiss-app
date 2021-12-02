import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DepoziteService } from '../../depozite.service';
import { depoziteCreationDTO, depoziteDTO } from '../depozite.model';

@Component({
  selector: 'app-depozite-edit',
  templateUrl: './depozite-edit.component.html',
  styleUrls: ['./depozite-edit.component.scss']
})
export class DepoziteEditComponent implements OnInit {

  constructor(private activatedRoute: ActivatedRoute,private router:Router, 
    private depoziteService: DepoziteService) { }

  model!:depoziteDTO;
  ngOnInit(): void {
    this.activatedRoute.params.subscribe(params => {
      this.depoziteService.getById(params.id).subscribe(depozit => {
        this.model = depozit;
        console.log(this.model);
      })
    });
  }
  saveChanges(depoziteCreationDTO:depoziteCreationDTO){
    this.depoziteService.edit(this.model.id, depoziteCreationDTO)
    .subscribe(() => {
      this.router.navigate(["/depozite"]);
    });
  }

}
