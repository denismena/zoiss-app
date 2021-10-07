import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatTable } from '@angular/material/table';
import { ActivatedRoute } from '@angular/router';
import { clientiAdresaDTO } from '../clienti-item/clienti.model';
import { ClientiService } from '../clienti.service';

@Component({
  selector: 'app-clienti-adresa',
  templateUrl: './clienti-adresa.component.html',
  styleUrls: ['./clienti-adresa.component.scss']
})
export class ClientiAdresaComponent implements OnInit {

  constructor(private activatedRoute: ActivatedRoute, private formBuilder:FormBuilder, private clientService: ClientiService) { 
   this.adreseList=[]; 
  }

  public form!: FormGroup;
  
  @Input()
  adreseList: clientiAdresaDTO[];
  
  columnsToDisplay = ['adresa', 'oras', 'tara', 'tel', 'email', 'actions']

  @ViewChild(MatTable)
  table!: MatTable<any>;
  
  ngOnInit(): void {

    this.form = this.formBuilder.group({
      adresa:[null, {validators:[Validators.required]}],
      oras:'',
      tara:'',
      tel:[null, {validators:[Validators.required]}],
      email:'',
      sediu: true,
      livrare: true
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
}
