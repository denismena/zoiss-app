import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ProduseService } from '../../produse.service';
import { produseCreationDTO,produseDTO } from '../produse.model';

@Component({
  selector: 'app-produse-edit',
  templateUrl: './produse-edit.component.html',
  styleUrls: ['./produse-edit.component.scss']
})
export class ProduseEditComponent implements OnInit {

  constructor(private activatedRoute: ActivatedRoute,private router:Router, private produsService: ProduseService) { }

  model!:produseDTO;
  ngOnInit(): void {
    this.activatedRoute.params.subscribe(params => {
      this.produsService.getById(params.id).subscribe(produs => {
        this.model = produs;
        console.log(this.model);
      })
    });
  }
  saveChanges(produseCreationDTO:produseCreationDTO){
    this.produsService.edit(this.model.id, produseCreationDTO)
    .subscribe(() => {
      this.router.navigate(["/produse"]);
    });
  }

}
