import { Component, DestroyRef, inject, OnInit } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router } from '@angular/router';
import { parseWebAPIErrors } from 'src/app/utilities/utils';
import { ClientiService } from '../../clienti.service';
import { clientiDTO, clientiCreationDTO, clientiAdresaDTO } from '../clienti.model';

@Component({
    selector: 'app-clienti-edit',
    templateUrl: './clienti-edit.component.html',
    styleUrls: ['./clienti-edit.component.scss'],
    standalone: false
})
export class ClientiEditComponent implements OnInit {

  private destroyRef = inject(DestroyRef);
  constructor(private activatedRoute: ActivatedRoute,private router:Router, private clientiService: ClientiService) { }

  adreseList: clientiAdresaDTO[] = [];
  model!:clientiDTO;
  errors: string[] = [];
  ngOnInit(): void {
    this.activatedRoute.params.subscribe(params => {
      if(params.id == undefined) return;
      this.clientiService.putGet(params.id)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: client => {
          this.model = client.client;
          this.adreseList = client.adrese;
        },
        error: error => this.errors = parseWebAPIErrors(error)
      })
    });
  }
  saveChanges(clientiCreationDTO:clientiCreationDTO){
    this.clientiService.edit(this.model.id, clientiCreationDTO)
    .pipe(takeUntilDestroyed(this.destroyRef))
    .subscribe({
      next: () => this.router.navigate(["/clienti"]),
      error: error => this.errors = parseWebAPIErrors(error)
    });
  }
}
