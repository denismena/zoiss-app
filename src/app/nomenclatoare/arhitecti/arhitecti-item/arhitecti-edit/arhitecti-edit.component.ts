import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ArhitectiService } from '../../arhitecti.service';
import { arhitectiCreationDTO, arhitectiDTO } from '../arhitecti.model';

@Component({
  selector: 'app-arhitecti-edit',
  templateUrl: './arhitecti-edit.component.html',
  styleUrls: ['./arhitecti-edit.component.scss']
})
export class ArhitectiEditComponent implements OnInit {

  constructor(private activatedRoute: ActivatedRoute,private router:Router, private arhitectiService: ArhitectiService) { }
  
  model!:arhitectiDTO;
  ngOnInit(): void {
    this.activatedRoute.params.subscribe(params => {
      this.arhitectiService.getById(params.id).subscribe(arhitect => {
        this.model = arhitect;
        console.log(this.model);
      })
    });
  }

  saveChanges(arhitectiCreationDTO:arhitectiCreationDTO){
    this.arhitectiService.edit(this.model.id, arhitectiCreationDTO)
    .subscribe(() => {
      this.router.navigate(["/arhitecti"]);
    });
  }

}
