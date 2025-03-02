import { Component, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatTable } from '@angular/material/table';
import { ActivatedRoute } from '@angular/router';
import { RxwebValidators } from '@rxweb/reactive-form-validators';
import { depoziteDTO } from '../../depozite/depozite-item/depozite.model';
import { DepoziteService } from '../../depozite/depozite.service';
import { clientiAdresaDTO } from '../clienti-item/clienti.model';
import { ClientiService } from '../clienti.service';
import { UnsubscribeService } from 'src/app/unsubscribe.service';
import { takeUntil } from 'rxjs/operators';

@Component({
    selector: 'app-clienti-adresa',
    templateUrl: './clienti-adresa.component.html',
    styleUrls: ['./clienti-adresa.component.scss'],
    standalone: false
})
export class ClientiAdresaComponent implements OnInit, OnDestroy {

  constructor(private formBuilder:FormBuilder, private depoziteService: DepoziteService, private unsubscribeService: UnsubscribeService) { 
   this.adreseList=[]; 
  }

  public form!: FormGroup;
  showLivrare: boolean = true;
  @Input()
  adreseList: clientiAdresaDTO[];
  depozite: depoziteDTO[] = [];
  isEditMode: boolean=false;
  columnsToDisplay = ['adresa', 'oras', 'judet', 'tara', 'tel', 'email', 'sediu', 'livrare', 'depozit', 'actions']

  @ViewChild(MatTable)
  table!: MatTable<any>;
  
  ngOnInit(): void {

    this.form = this.formBuilder.group({
      adresa:[null, {validators:[RxwebValidators.required(), RxwebValidators.maxLength({value:255 })]}],
      oras:[null, {validators:[RxwebValidators.maxLength({value:50 })]}],
      judet:[null, {validators:[RxwebValidators.maxLength({value:50 })]}],
      tara:[null, {validators:[RxwebValidators.maxLength({value:50 })]}],
      tel:[null, {validators:[RxwebValidators.maxLength({value:50 })]}],
      email:[null, {validators: [RxwebValidators.email(), RxwebValidators.maxLength({value:100 })]}],
      sediu: [true,{validators:[RxwebValidators.requiredTrue({conditionalExpression:(x:any)=>x.livrare == false})]}],
      livrare: true,
      depozitId: [null, {validators:[RxwebValidators.required({conditionalExpression:(x:any)=>x.livrare == true})]}],
      id:null, clientId:null, depozit:null
    });

    this.loadDepozite();
  }

  loadDepozite()
  {
    this.depoziteService.getAll()
    .pipe(takeUntil(this.unsubscribeService.unsubscribeSignal$))
    .subscribe(depozite=>{
      this.depozite = depozite;
      console.log(this.depozite);
    });
  }
  saveChanges(){
    if(this.form.get('id')?.value !=null && this.isEditMode){
      let index = this.adreseList.findIndex(a => a.id === Number(this.form.get('id')?.value));
      this.adreseList[index]=this.form.value;
    }
    else this.adreseList.push(this.form.value);
    if (this.table !== undefined){
      this.table.renderRows();
    }
    this.form.reset();
    this.isEditMode = false;
  }

  remove(adrese:any){
    console.log('delete adresa', adrese);
    const index = this.adreseList.findIndex(a => a.adresa === adrese.adresa);
    this.adreseList.splice(index, 1);
    this.table.renderRows();
  }
  edit(produs:any){
    console.log('produs', produs);
    this.form.setValue(produs);    
    this.isEditMode = true;
  }
  clearForm(){
    this.form.reset();    
    this.isEditMode = false; 
  }

  changeLivrare(event: any){
    console.log(event.checked);
    if(event.checked)
    {
        this.showLivrare = true;
    }
    else{
        this.showLivrare=false;
        this.form.get('depozitId')?.setValue(null);
    }
  }
  changeDepozit(depozit:any){
    this.form.get('depozit')?.setValue(depozit.selectedOptions[0].text);
  }

  ngOnDestroy(): void {}
}
