import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { clientiAdresaDTO, clientiDTO } from './clienti.model';

@Component({
  selector: 'app-clienti-item',
  templateUrl: './clienti-item.component.html',
  styleUrls: ['./clienti-item.component.scss']
})
export class ClientiItemComponent implements OnInit {

  constructor(private activatedRoute: ActivatedRoute, private formBuilder:FormBuilder) { }
  public form!: FormGroup;  
  @Input()
  model:clientiDTO | undefined;
  @Input()
  adreseList: clientiAdresaDTO[] = [];
  
  isPF: boolean = false;
  
  @Output()
  onSaveChanges: EventEmitter<clientiDTO> = new EventEmitter<clientiDTO>();
  ngOnInit(): void {
    this.activatedRoute.params.subscribe(params=>{
      //alert(params.id);
    });
    this.form = this.formBuilder.group({
      nume:['', {validators:[Validators.required]}],
      pfPj: 'PJ',
      cuiCnp:'',
      registruComert:'',
      persoanaContact: null,
      persoanaContactTel: null,
      active: true,
      adrese: null
    });
    if(this.model !== undefined)
    {
      console.log('model: ', this.model);
      this.form.patchValue(this.model);
      
      this.form.controls['pfPj'].setValue(this.model.pfPj);
      if(this.model.pfPj=='PF'){
        this.isPF= true;
      }else{
        this.isPF = false;
      }
    }

    this.form.valueChanges.subscribe(res=>{
      if(res.pfPj=='PF'){
        this.isPF= true;
      }else{
        this.isPF = false;
      }
   });
  }
  saveChanges(){    
    //set the adrese list to model
    const adrese = this.adreseList.map(val => {
      return {id: val.id, adresa: val.adresa, oras: val.oras, tara: val.tara,
        tel: val.tel, email: val.email, sediu: val.sediu, livrare: val.livrare}
    });
    console.log('set adrese', adrese);
    this.form.get('adrese')?.setValue(adrese);

    console.log('click done',this.form.value);
    this.onSaveChanges.emit(this.form.value);
  }
}
