import { Component, DestroyRef, inject, OnInit } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Router } from '@angular/router';
import { NIRService } from '../../nir.service';
import { nirDTO } from '../nir.model';
import { parseWebAPIErrors } from 'src/app/utilities/utils';

@Component({
    selector: 'app-nir-create',
    templateUrl: './nir-create.component.html',
    styleUrls: ['./nir-create.component.scss'],
    standalone: false
})
export class NirCreateComponent implements OnInit {
  errors: string[] = [];

  private destroyRef = inject(DestroyRef);
  constructor(private router:Router, private nirService: NIRService) { }
  ngOnInit(): void {
    
  }

  saveChanges(nirDTO:nirDTO){
    console.log('nirDTO', nirDTO);
    this.nirService.create(nirDTO)
    .pipe(takeUntilDestroyed(this.destroyRef))
    .subscribe(()=>{
      this.router.navigate(['/nir'])
    }, 
    error=> this.errors = parseWebAPIErrors(error));    
  }
}
