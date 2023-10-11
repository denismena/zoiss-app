import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { parseWebAPIErrors } from 'src/app/utilities/utils';
import { userCredentials } from '../security.models';
import { SecurityService } from '../security.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  constructor(private securityservice: SecurityService, private router: Router) { }
  errors: string[] = [];
  scannerEnabled: boolean = false;

  ngOnInit(): void {
  }
  login(userCredentials: userCredentials){
    this.securityservice.login(userCredentials).subscribe(authenticatorResponse=>{
      this.securityservice.saveToke(authenticatorResponse);
      this.router.navigate(['/']);
    }, error=> this.errors = parseWebAPIErrors(error));
  }

}
