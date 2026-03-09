import { Component, DestroyRef, inject, OnInit } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Router } from '@angular/router';
import { parseWebAPIErrors } from 'src/app/utilities/utils';
import { ProduseService } from '../../produse.service';
import { produseCreationDTO } from '../produse.model';

@Component({
    selector: 'app-produse-create',
    templateUrl: './produse-create.component.html',
    styleUrls: ['./produse-create.component.scss'],
    standalone: false
})
export class ProduseCreateComponent implements OnInit {

  errors: string[] = [];
  private destroyRef = inject(DestroyRef);
  constructor(private router:Router, private produsService: ProduseService) { }

  ngOnInit(): void {
  }
  saveChanges(produseDTO: produseCreationDTO){    
    this.produsService.create(produseDTO)
    .pipe(takeUntilDestroyed(this.destroyRef))
    .subscribe(()=>{
      this.router.navigate(['/produse'])
    }, 
    error=> this.errors = parseWebAPIErrors(error));    
  }
}
