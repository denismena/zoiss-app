import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatTable } from '@angular/material/table';
import { ActivatedRoute } from '@angular/router';
import { RxwebValidators } from '@rxweb/reactive-form-validators';
import { depoziteDTO } from '../../depozite/depozite-item/depozite.model';
import { DepoziteService } from '../../depozite/depozite.service';
import { clientiAdresaDTO } from '../clienti-item/clienti.model';
import { ClientiService } from '../clienti.service';

@Component({
  selector: 'app-clienti-adresa',
  templateUrl: './clienti-adresa.component.html',
  styleUrls: ['./clienti-adresa.component.scss']
})
export class ClientiAdresaComponent implements OnInit {

  constructor(private activatedRoute: ActivatedRoute, private formBuilder:FormBuilder, 
    private clientService: ClientiService, private depoziteService: DepoziteService) { 
   this.adreseList=[]; 
  }

  public form!: FormGroup;
  showLivrare: boolean = true;
  @Input()
  adreseList: clientiAdresaDTO[];

  depozite: depoziteDTO[] = [];
  
  columnsToDisplay = ['adresa', 'oras', 'tara', 'tel', 'email', 'actions']

  @ViewChild(MatTable)
  table!: MatTable<any>;
  
  ngOnInit(): void {

    this.form = this.formBuilder.group({
      adresa:[null, {validators:[RxwebValidators.required(), RxwebValidators.maxLength({value:255 })]}],
      oras:[null, {validators:[RxwebValidators.maxLength({value:50 })]}],
      tara:[null, {validators:[RxwebValidators.maxLength({value:50 })]}],
      tel:[null, {validators:[RxwebValidators.required(), RxwebValidators.maxLength({value:50 })]}],
      email:[null, {validators: [RxwebValidators.email(), RxwebValidators.maxLength({value:100 })]}],
      sediu: true,
      livrare: true,
      depozitId: [null, {validators:[RxwebValidators.required({conditionalExpression:(x:any)=>x.livrare == true})]}]
    });

    this.loadDepozite();
  }

  loadDepozite()
  {
    this.depoziteService.getAll().subscribe(depozite=>{
      this.depozite = depozite;
      console.log(this.depozite);
    });
  }
  saveChanges(){
    console.log('save produse', this.form.value);    
    this.adreseList.push(this.form.value);
    if (this.table !== undefined){
      this.table.renderRows();
    }
    this.form.reset();
  }

  remove(adrese:any){
    console.log('delete adresa', adrese);
    const index = this.adreseList.findIndex(a => a.adresa === adrese.adresa);
    this.adreseList.splice(index, 1);
    this.table.renderRows();
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
}
