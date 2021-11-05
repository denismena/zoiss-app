import { error } from '@angular/compiler/src/util';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { parseWebAPIErrors } from 'src/app/utilities/utils';
import { userCredentials } from '../security.models';
import { SecurityService } from '../security.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {

  constructor(private securityService: SecurityService, private router: Router) { }
  errors: string[] = [];
  
  ngOnInit(): void {
  }
  register(userCredentials: userCredentials){
    this.errors=[];
    this.securityService.register(userCredentials).subscribe(authenticationResponse=>{
      this.securityService.saveToke(authenticationResponse);
      this.router.navigate(['/']);
    }, error=> this.errors = parseWebAPIErrors(error));
  }
}
