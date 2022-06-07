import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SucursaleService } from '../../sucursala.service';
import { sucursalaCreationDTO, sucursalaDTO } from '../sucursala.model';

@Component({
  selector: 'app-sucursale-edit',
  templateUrl: './sucursale-edit.component.html',
  styleUrls: ['./sucursale-edit.component.scss']
})
export class SucursaleEditComponent implements OnInit {

  constructor(private activatedRoute: ActivatedRoute,private router:Router, private sucursaleService: SucursaleService) { }

  model!:sucursalaDTO;
  ngOnInit(): void {
    this.activatedRoute.params.subscribe(params => {
      this.sucursaleService.getById(params.id).subscribe(um => {
        this.model = um;
      })
    });
  }
  saveChanges(sucursalaCreationDTO:sucursalaCreationDTO){
    this.sucursaleService.edit(this.model.id, sucursalaCreationDTO)
    .subscribe(() => {
      this.router.navigate(["/sucursale"]);
    });
  }

}
