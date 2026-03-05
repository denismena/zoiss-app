import { Component, DestroyRef, inject, OnInit } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Router } from '@angular/router';
import { parseWebAPIErrors } from 'src/app/utilities/utils';
import { ClientiService } from '../../clienti.service';
import { clientiDTO } from '../clienti.model';

@Component({
    selector: 'app-clienti-create',
    templateUrl: './clienti-create.component.html',
    styleUrls: ['./clienti-create.component.scss'],
    standalone: false
})
export class ClientiCreateComponent implements OnInit {

  errors: string[] = [];
  private destroyRef = inject(DestroyRef);
  constructor(private router:Router, private clientiService: ClientiService) { }

  ngOnInit(): void {
  }
  saveChanges(clientiDTO:clientiDTO){
    this.clientiService.create(clientiDTO)
    .pipe(takeUntilDestroyed(this.destroyRef))
    .subscribe(()=>{
      this.router.navigate(['/clienti'])
    }, 
    error=> this.errors = parseWebAPIErrors(error));    
  }
}
