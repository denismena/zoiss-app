import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { parseWebAPIErrors } from 'src/app/utilities/utils';
import { confirmEmail } from '../security.models';
import { SecurityService } from '../security.service';

@Component({
  selector: 'app-confirm-email',
  templateUrl: './confirm-email.component.html',
  styleUrls: ['./confirm-email.component.scss']
})
export class ConfirmEmailComponent implements OnInit {

  constructor(private securityService: SecurityService, private activatedRoute: ActivatedRoute) { }
  errors: string[] = [];
  success: boolean = false;
  
  ngOnInit(): void {
    this.activatedRoute.queryParams.subscribe(params => {
      const confEmail: confirmEmail = { email: params.email, token: params.token };
      this.confirm(confEmail);
    })
  }
  confirm(userCredentials: confirmEmail){
    this.errors=[];
    this.success=false;
    //console.log('userCredentials', userCredentials);
    this.securityService.confirmEmail(userCredentials).subscribe(authenticationResponse=>{
      //console.log('authenticationResponse', authenticationResponse);
      if(authenticationResponse != null){
        this.success=true;
        //this.confirmEmail(userCredentials.email);
      }
    }, error=> this.errors = parseWebAPIErrors(error));
  }
}
