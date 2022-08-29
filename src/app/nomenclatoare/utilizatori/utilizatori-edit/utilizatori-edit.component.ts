import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { RxwebValidators } from '@rxweb/reactive-form-validators';
import { userCredentials, UtilizatoriDTO } from 'src/app/security/security.models';
import { SecurityService } from 'src/app/security/security.service';
import { parseWebAPIErrors } from 'src/app/utilities/utils';
import { SucursaleService } from '../../sucursale/sucursala.service';
import { sucursalaDTO } from '../../sucursale/sucursale-item/sucursala.model';

@Component({
  selector: 'app-utilizatori-edit',
  templateUrl: './utilizatori-edit.component.html',
  styleUrls: ['./utilizatori-edit.component.scss']
})
export class UtilizatoriEditComponent implements OnInit {

  constructor(private securityService: SecurityService, private router: Router, 
    private formBuilder: UntypedFormBuilder, private activatedRoute: ActivatedRoute, private sucursaleService: SucursaleService) { 
      
    }
  errors: string[] = [];
  public form!: UntypedFormGroup;
  public model!: UtilizatoriDTO;
  sucursaleList: sucursalaDTO[]=[];

  ngOnInit(): void {   

    this.activatedRoute.params.subscribe(params => {
      this.securityService.getById(params.id).subscribe(util => {
        this.model = util;
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
      sucursalaId: null
    })

    this.sucursaleService.getAll().subscribe(sucursale=>{
      this.sucursaleList=sucursale;      
    })
  }

  edit(utilizatoriDTO: UtilizatoriDTO){
    this.errors=[];
    if(utilizatoriDTO.sucursalaId == 0) utilizatoriDTO.sucursalaId = null;
    this.securityService.edit(this.model.id, utilizatoriDTO).subscribe(authenticationResponse=>{
      if(this.model.email == this.securityService.getFieldFromJwt('email'))
        this.securityService.saveToke(authenticationResponse);
      this.router.navigate(['/utilizatori']);
    }, error=> this.errors = parseWebAPIErrors(error));
  }

  selectParent(depozit: any){       
    this.form.get('sucursalaId')?.setValue(depozit.value);
  }

}
