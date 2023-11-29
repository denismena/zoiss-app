import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { parseWebAPIErrors } from 'src/app/utilities/utils';
import { ClientiService } from '../../clienti.service';
import { clientiDTO, clientiCreationDTO, clientiAdresaDTO } from '../clienti.model';
import { UnsubscribeService } from 'src/app/unsubscribe.service';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-clienti-edit',
  templateUrl: './clienti-edit.component.html',
  styleUrls: ['./clienti-edit.component.scss']
})
export class ClientiEditComponent implements OnInit, OnDestroy {

  constructor(private activatedRoute: ActivatedRoute,private router:Router, private clientiService: ClientiService, private unsubscribeService: UnsubscribeService) { }

  adreseList: clientiAdresaDTO[] = [];
  model!:clientiDTO;
  errors: string[] = [];
  ngOnInit(): void {
    this.activatedRoute.params.subscribe(params => {
      if(params.id == undefined) return;
      this.clientiService.putGet(params.id)
      .pipe(takeUntil(this.unsubscribeService.unsubscribeSignal$))
      .subscribe(client => {
        this.model = client.client;
        this.adreseList = client.adrese;
      }, error => {
        this.errors = parseWebAPIErrors(error);      
      })
    });
  }
  saveChanges(clientiCreationDTO:clientiCreationDTO){
    this.clientiService.edit(this.model.id, clientiCreationDTO)
    .pipe(takeUntil(this.unsubscribeService.unsubscribeSignal$))
    .subscribe(() => {
      this.router.navigate(["/clienti"]);
    });
  }

  ngOnDestroy(): void {}
}
