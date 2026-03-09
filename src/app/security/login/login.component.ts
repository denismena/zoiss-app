import { Component, DestroyRef, inject, OnInit } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Router } from '@angular/router';
import { parseWebAPIErrors } from 'src/app/utilities/utils';
import { userCredentials } from '../security.models';
import { SecurityService } from '../security.service';

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss'],
    standalone: false
})
export class LoginComponent implements OnInit {

  private destroyRef = inject(DestroyRef);
  constructor(private securityservice: SecurityService, private router: Router) { }
  errors: string[] = [];
  scannerEnabled: boolean = false;

  ngOnInit(): void {
  }
  login(userCredentials: userCredentials){
    this.securityservice.login(userCredentials)
    .pipe(takeUntilDestroyed(this.destroyRef))
    .subscribe(authenticatorResponse=>{
      this.securityservice.saveToken(authenticatorResponse);
      this.router.navigate(['/home']);
    }, error=> this.errors = parseWebAPIErrors(error));
  }

}
