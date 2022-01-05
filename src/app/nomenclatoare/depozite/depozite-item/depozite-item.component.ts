import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { NumericValueType, RxwebValidators } from '@rxweb/reactive-form-validators';
import { RegexValidator } from '@rxweb/reactive-form-validators/util';
import { DepoziteService } from '../depozite.service';
import { depoziteDTO } from './depozite.model';

@Component({
  selector: 'app-depozite-item',
  templateUrl: './depozite-item.component.html',
  styleUrls: ['./depozite-item.component.scss']
})
export class DepoziteItemComponent implements OnInit {

  constructor(private activatedRoute: ActivatedRoute,private formBuilder: FormBuilder, private depoztService: DepoziteService) { }
  public form!: FormGroup;
  @Input()
  model:depoziteDTO | undefined;
  depozitList: depoziteDTO[]=[];
  @Output()
  onSaveChanges: EventEmitter<depoziteDTO> = new EventEmitter<depoziteDTO>();

  ngOnInit(): void {
    this.activatedRoute.params.subscribe(params=>{
      //alert(params.id);
    });

    this.form = this.formBuilder.group({
      nume:['', {validators:[RxwebValidators.required(), RxwebValidators.maxLength({value:150 })]}],
      adresa: ['', {validators:[RxwebValidators.maxLength({value:255 })]}],
      persoanaContact: ['', {validators:[RxwebValidators.maxLength({value:50 })]}],      
      persoanaContactTel: ['', {validators:[RxwebValidators.maxLength({value:50 })]}],
      persoanaContactEmail: [null, {validators: [RxwebValidators.email(), RxwebValidators.maxLength({value:100 })]}],
      parentId: [null, {validators:[RxwebValidators.noneOf({matchValues:[this.model?.id]})]}],
      active: true
    });

    this.depoztService.getAll().subscribe(depozite=>{
      this.depozitList=depozite;
      console.log('this.depozitList', this.depozitList);
    })

    if(this.model !== undefined)
    {
      this.form.patchValue(this.model);
    }
  }

  saveChanges(){
    this.onSaveChanges.emit(this.form.value);
  }

  selectParent(depozit: any){       
    console.log('depozit', depozit);
    this.form.get('parentId')?.setValue(depozit.value);
    console.log('depozit', depozit.value);    
  }

}
