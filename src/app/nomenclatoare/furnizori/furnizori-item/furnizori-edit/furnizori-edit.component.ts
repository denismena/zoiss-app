import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FurnizoriService } from '../../furnizori.service';
import { furnizoriDTO, furnizoriCreationDTO } from '../furnizori.model';

@Component({
  selector: 'app-furnizori-edit',
  templateUrl: './furnizori-edit.component.html',
  styleUrls: ['./furnizori-edit.component.scss']
})
export class FurnizoriEditComponent implements OnInit {

  constructor(private activatedRoute: ActivatedRoute,private router:Router, private furnizoriService: FurnizoriService) { }

  model!:furnizoriDTO;// = { nume:'furnizor ion', tara:'Romania', adresa:'Soveja 62, Constanta', tel: '9832/332344', email: 'sad@dddsf.ro', active: true}
  ngOnInit(): void {
    this.activatedRoute.params.subscribe(params => {
      this.furnizoriService.getById(params.id).subscribe(furnizor => {
        this.model = furnizor;
        console.log(this.model);
      })
    });
  }
  saveChanges(furnizoriCreationDTO:furnizoriCreationDTO){
    this.furnizoriService.edit(this.model.id, furnizoriCreationDTO)
    .subscribe(() => {
      this.router.navigate(["/furnizori"]);
    });
  }

}
