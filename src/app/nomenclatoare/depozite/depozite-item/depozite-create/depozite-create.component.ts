import { Component, DestroyRef, inject, OnInit } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Router } from '@angular/router';
import { parseWebAPIErrors } from 'src/app/utilities/utils';
import { DepoziteService } from '../../depozite.service';
import { depoziteDTO } from '../depozite.model';

@Component({
    selector: 'app-depozite-create',
    templateUrl: './depozite-create.component.html',
    styleUrls: ['./depozite-create.component.scss'],
    standalone: false
})
export class DepoziteCreateComponent implements OnInit {

  errors: string[] = [];
  private destroyRef = inject(DestroyRef);
  constructor(private router:Router, private depoziteService: DepoziteService) { }

  ngOnInit(): void {
  }

  saveChanges(depoziteDTO: depoziteDTO){
    this.depoziteService.create(depoziteDTO)
    .pipe(takeUntilDestroyed(this.destroyRef))
    .subscribe(()=>{
      this.router.navigate(['/depozite'])
    }, 
    error=> this.errors = parseWebAPIErrors(error));    
  }
}
