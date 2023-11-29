import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { NumericValueType, RxwebValidators } from '@rxweb/reactive-form-validators';
import { DepoziteService } from '../depozite.service';
import { depoziteDTO } from './depozite.model';
import { UnsubscribeService } from 'src/app/unsubscribe.service';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-depozite-item',
  templateUrl: './depozite-item.component.html',
  styleUrls: ['./depozite-item.component.scss']
})
export class DepoziteItemComponent implements OnInit, OnDestroy {

  constructor(private formBuilder: FormBuilder, private depoztService: DepoziteService, private unsubscribeService: UnsubscribeService) { }
  public form!: FormGroup;
  @Input()
  model:depoziteDTO | undefined;
  depozitList: depoziteDTO[]=[];
  @Output()
  onSaveChanges: EventEmitter<depoziteDTO> = new EventEmitter<depoziteDTO>();

  ngOnInit(): void {    

    this.form = this.formBuilder.group({
      nume:['', {validators:[RxwebValidators.required(), RxwebValidators.maxLength({value:150 })]}],
      adresa: ['', {validators:[RxwebValidators.maxLength({value:255 })]}],
      persoanaContact: ['', {validators:[RxwebValidators.maxLength({value:50 })]}],      
      persoanaContactTel: ['', {validators:[RxwebValidators.maxLength({value:50 })]}],
      persoanaContactEmail: [null, {validators: [RxwebValidators.email(), RxwebValidators.maxLength({value:100 })]}],
      parentId: [null, {validators:[RxwebValidators.noneOf({matchValues:[this.model?.id]})]}],
      sort:[null, {validators:[RxwebValidators.required(), RxwebValidators.numeric({acceptValue:NumericValueType.PositiveNumber  ,allowDecimal:false })]}],
      active: true
    });

    this.depoztService.getAll()
    .pipe(takeUntil(this.unsubscribeService.unsubscribeSignal$))
    .subscribe(depozite=>{
      this.depozitList=depozite;
    })

    if(this.model !== undefined)
    {
      this.form.patchValue(this.model);
    }
  }

  saveChanges(){
    if(this.form.valid)
      this.onSaveChanges.emit(this.form.value);
  }

  selectParent(depozit: any){       
    this.form.get('parentId')?.setValue(depozit.value);
  }

  ngOnDestroy(): void {}

}
