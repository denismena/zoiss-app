import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { parseWebAPIErrors } from 'src/app/utilities/utils';
import { ProduseService } from '../../produse.service';
import { produseCreationDTO } from '../produse.model';

@Component({
  selector: 'app-produse-create-dialog',
  templateUrl: './produse-create-dialog.component.html',
  styleUrls: ['./produse-create-dialog.component.scss']
})
export class ProduseCreateDialogComponent implements OnInit {

  errors: string[] = [];
  constructor(private router:Router, private produsService: ProduseService,
    @Inject(MAT_DIALOG_DATA) data:{},
    public dialogRef: MatDialogRef<ProduseCreateDialogComponent>) { }

  ngOnInit(): void {
    console.log('dialogRef', this.dialogRef);
  }
  saveChanges(produseDTO: produseCreationDTO){
    
    this.produsService.create(produseDTO).subscribe(id=>{      
      console.log('id:', id);
      this.dialogRef.close({
        clicked: 'submit',
        form: produseDTO,
        id: id
      });
  
      console.log('produsService.create subscribe');
    }, 
    error=> this.errors = parseWebAPIErrors(error));    
  }

}
