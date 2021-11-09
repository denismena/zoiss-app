import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { RxwebValidators } from '@rxweb/reactive-form-validators';
import { userCredentials, UtilizatoriDTO } from 'src/app/security/security.models';
import { SecurityService } from 'src/app/security/security.service';
import { parseWebAPIErrors } from 'src/app/utilities/utils';

@Component({
  selector: 'app-utilizatori-edit',
  templateUrl: './utilizatori-edit.component.html',
  styleUrls: ['./utilizatori-edit.component.scss']
})
export class UtilizatoriEditComponent implements OnInit {

  constructor(private securityService: SecurityService, private router: Router, 
    private formBuilder: FormBuilder, private activatedRoute: ActivatedRoute) { 
      
    }
  errors: string[] = [];
  public form!: FormGroup;
  public model!: UtilizatoriDTO;

  ngOnInit(): void {   

    this.activatedRoute.params.subscribe(params => {
      this.securityService.getById(params.id).subscribe(util => {
        this.model = util;
        console.log(this.model);
        if(this.model !== undefined)
        {
          this.form.patchValue(this.model);
        }
      })
    });

    this.form = this.formBuilder.group({     
      email: [null, {validators:[RxwebValidators.required(), RxwebValidators.email() ]}], 
      name: [null,{validators:[RxwebValidators.required()]}],
      phoneNumber: [null,{validators:[RxwebValidators.required()]}],
    })

    
  }
  edit(utilizatoriDTO: UtilizatoriDTO){
    this.errors=[];
    console.log(this.model.id);
    this.securityService.edit(this.model.id, utilizatoriDTO).subscribe(authenticationResponse=>{
      this.securityService.saveToke(authenticationResponse);
      this.router.navigate(['/utilizatori']);
    }, error=> this.errors = parseWebAPIErrors(error));
  }

}
