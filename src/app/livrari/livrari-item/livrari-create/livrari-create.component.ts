import { Component, DestroyRef, inject, OnInit } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Router } from '@angular/router';
import { parseWebAPIErrors } from 'src/app/utilities/utils';
import { LivrariService } from '../../livrari.service';
import { livrariCreationDTO } from '../livrari.model';

@Component({
    selector: 'app-livrari-create',
    templateUrl: './livrari-create.component.html',
    styleUrls: ['./livrari-create.component.scss'],
    standalone: false
})
export class LivrariCreateComponent implements OnInit {

  private destroyRef = inject(DestroyRef);
  errors: string[] = [];
  constructor(private router:Router, private livrariService: LivrariService) { }

  ngOnInit(): void {
  }

  saveChanges(livrariCreationDTO:livrariCreationDTO){
    this.livrariService.create(livrariCreationDTO)
    .pipe(takeUntilDestroyed(this.destroyRef))
    .subscribe(()=>{
      this.router.navigate(['/livrari'])
    }, 
    error=> this.errors = parseWebAPIErrors(error));    
  }

}
