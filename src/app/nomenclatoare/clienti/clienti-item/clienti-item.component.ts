import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { RxwebValidators } from '@rxweb/reactive-form-validators';
import { clientiAdresaDTO, clientiDTO } from './clienti.model';

@Component({
  selector: 'app-clienti-item',
  templateUrl: './clienti-item.component.html',
  styleUrls: ['./clienti-item.component.scss']
})
export class ClientiItemComponent implements OnInit {

  constructor(private activatedRoute: ActivatedRoute, private formBuilder:FormBuilder,private router:Router) { }
  public form!: FormGroup;  
  @Input()model:clientiDTO | undefined;
  @Input()adreseList: clientiAdresaDTO[] = [];
  @Input() isDialog:boolean = false;
  
  isPF: boolean = false;
  
  @Output()
  onSaveChanges: EventEmitter<clientiDTO> = new EventEmitter<clientiDTO>();
  ngOnInit(): void {
    this.activatedRoute.params.subscribe(params=>{
      //alert(params.id);
    });
    this.form = this.formBuilder.group({
      nume:['', {validators:[RxwebValidators.required(), RxwebValidators.maxLength({value:150 })]}],
      pfPj: 'PJ',
      cuiCnp:'',
      registruComert:['', {validators:[RxwebValidators.maxLength({value:150 })]}],
      persoanaContact: [null, {validators:[RxwebValidators.maxLength({value:50 })]}],
      persoanaContactTel: [null, {validators:[RxwebValidators.maxLength({value:50 })]}],
      persoanaContactEmail: [null, {validators: [RxwebValidators.email(), RxwebValidators.maxLength({value:100 })]}],
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

  cancel(){
    if(this.isDialog) this.onSaveChanges.emit(undefined);
    else this.router.navigate(["/clienti"]);
  }
  saveChanges(){    
    //set the adrese list to model
    const adrese = this.adreseList.map(val => {
      return {id: val.id??0, adresa: val.adresa, oras: val.oras, judet: val.judet, tara: val.tara,
        tel: val.tel, email: val.email, sediu: val.sediu, livrare: val.livrare, depozitId: val.depozitId}
    });
    this.form.get('adrese')?.setValue(adrese);

    this.onSaveChanges.emit(this.form.value);
  }
}
