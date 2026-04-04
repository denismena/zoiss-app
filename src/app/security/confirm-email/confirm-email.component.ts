import { Component, DestroyRef, inject, OnInit } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ActivatedRoute } from '@angular/router';
import { parseWebAPIErrors } from 'src/app/utilities/utils';
import { confirmEmail } from '../security.models';
import { SecurityService } from '../security.service';

@Component({
    selector: 'app-confirm-email',
    templateUrl: './confirm-email.component.html',
    styleUrls: ['./confirm-email.component.scss'],
    standalone: false
})
export class ConfirmEmailComponent implements OnInit {

  private destroyRef = inject(DestroyRef);

  constructor(private securityService: SecurityService, private activatedRoute: ActivatedRoute) { }
  errors: string[] = [];
  success: boolean = false;
  
  ngOnInit(): void {
    this.activatedRoute.queryParams
    .pipe(takeUntilDestroyed(this.destroyRef))
    .subscribe(params => {
      const confEmail: confirmEmail = { email: params.email, token: params.token };
      this.confirm(confEmail);
    })
  }
  confirm(userCredentials: confirmEmail){
    this.errors=[];
    this.success=false;
    this.securityService.confirmEmail(userCredentials)
    .pipe(takeUntilDestroyed(this.destroyRef))
    .subscribe({
      next: authenticationResponse => {
        if(authenticationResponse != null){
          this.success=true;
        }
      },
      error: error => this.errors = parseWebAPIErrors(error)
    });
  }

}
