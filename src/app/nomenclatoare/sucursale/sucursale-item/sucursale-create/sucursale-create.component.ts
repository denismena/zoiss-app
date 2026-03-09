import { Component, DestroyRef, inject, OnInit } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Router } from '@angular/router';
import { parseWebAPIErrors } from 'src/app/utilities/utils';
import { SucursaleService } from '../../sucursala.service';
import { sucursalaCreationDTO } from '../sucursala.model';

@Component({
    selector: 'app-sucursale-create',
    templateUrl: './sucursale-create.component.html',
    styleUrls: ['./sucursale-create.component.scss'],
    standalone: false
})
export class SucursaleCreateComponent implements OnInit {

  errors: string[] = [];
  private destroyRef = inject(DestroyRef);
  constructor(private router:Router, private sucursaleService: SucursaleService) { }

  ngOnInit(): void {
  }
  saveChanges(sucursalaCreationDTO: sucursalaCreationDTO){
    this.sucursaleService.create(sucursalaCreationDTO)
    .pipe(takeUntilDestroyed(this.destroyRef))
    .subscribe(()=>{
      this.router.navigate(['/sucursale'])
    }, 
    error=> this.errors = parseWebAPIErrors(error));    
  }

}
