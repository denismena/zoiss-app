import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { parseWebAPIErrors } from 'src/app/utilities/utils';
import { confirmEmail } from '../security.models';
import { SecurityService } from '../security.service';
import { UnsubscribeService } from 'src/app/unsubscribe.service';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-confirm-email',
  templateUrl: './confirm-email.component.html',
  styleUrls: ['./confirm-email.component.scss']
})
export class ConfirmEmailComponent implements OnInit, OnDestroy {

  constructor(private securityService: SecurityService, private activatedRoute: ActivatedRoute, private unsubscribeService: UnsubscribeService) { }
  errors: string[] = [];
  success: boolean = false;
  
  ngOnInit(): void {
    this.activatedRoute.queryParams
    .pipe(takeUntil(this.unsubscribeService.unsubscribeSignal$))
    .subscribe(params => {
      const confEmail: confirmEmail = { email: params.email, token: params.token };
      this.confirm(confEmail);
    })
  }
  confirm(userCredentials: confirmEmail){
    this.errors=[];
    this.success=false;
    this.securityService.confirmEmail(userCredentials)
    .pipe(takeUntil(this.unsubscribeService.unsubscribeSignal$))
    .subscribe(authenticationResponse=>{
      if(authenticationResponse != null){
        this.success=true;
      }
    }, error=> this.errors = parseWebAPIErrors(error));
  }

  ngOnDestroy(): void {
  }
}
