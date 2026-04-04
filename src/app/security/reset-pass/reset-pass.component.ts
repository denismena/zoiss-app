import { Component, DestroyRef, inject, OnInit } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { RxwebValidators } from '@rxweb/reactive-form-validators';
import { parseWebAPIErrors } from 'src/app/utilities/utils';
import { resetPass } from '../security.models';
import { SecurityService } from '../security.service';

@Component({
    selector: 'app-reset-pass',
    templateUrl: './reset-pass.component.html',
    styleUrls: ['./reset-pass.component.scss'],
    standalone: false
})
export class ResetPassComponent implements OnInit {

  private destroyRef = inject(DestroyRef);
  constructor(private securityService: SecurityService, private router: Router, private formBuilder: FormBuilder,
    private activatedRoute: ActivatedRoute) { }
  errors: string[] = [];
  public form!: FormGroup;

  ngOnInit(): void {
    this.activatedRoute.queryParams.subscribe(params => {
      this.form = this.formBuilder.group({
        email: [params.email, {validators:[RxwebValidators.required(), RxwebValidators.email() ]}],
        token: [params.token,{validators:[RxwebValidators.required()]}],
        newpassword: [null,{validators:[RxwebValidators.required()]}],
        confirmPassword: [null,{validators:[RxwebValidators.required(), RxwebValidators.compare({fieldName:'newpassword'})]}]        
      })      
    })
  }

  register(userCredentials: resetPass){
    this.errors=[];    
    this.securityService.resetPassword(userCredentials)
    .pipe(takeUntilDestroyed(this.destroyRef))
    .subscribe({
      next: () => this.router.navigate(['/']),
      error: error => this.errors = parseWebAPIErrors(error)
    });
  }

}
