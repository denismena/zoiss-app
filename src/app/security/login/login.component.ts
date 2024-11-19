import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { parseWebAPIErrors } from 'src/app/utilities/utils';
import { userCredentials } from '../security.models';
import { SecurityService } from '../security.service';
import { UnsubscribeService } from 'src/app/unsubscribe.service';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit, OnDestroy {

  constructor(private securityservice: SecurityService, private router: Router, private unsubscribeService: UnsubscribeService) { }
  errors: string[] = [];
  scannerEnabled: boolean = false;

  ngOnInit(): void {
  }
  login(userCredentials: userCredentials){
    this.securityservice.login(userCredentials)
    .pipe(takeUntil(this.unsubscribeService.unsubscribeSignal$))
    .subscribe(authenticatorResponse=>{
      this.securityservice.saveToken(authenticatorResponse);
      this.router.navigate(['/home']);
    }, error=> this.errors = parseWebAPIErrors(error));
  }

  ngOnDestroy(): void {
  }
}
