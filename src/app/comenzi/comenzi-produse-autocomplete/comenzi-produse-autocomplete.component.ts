import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatTable } from '@angular/material/table';
import { ActivatedRoute } from '@angular/router';
import { NumericValueType, RxwebValidators } from '@rxweb/reactive-form-validators';
import { FurnizoriAutocompleteComponent } from 'src/app/nomenclatoare/furnizori/furnizori-autocomplete/furnizori-autocomplete.component';
import { ProduseAutocompleteComponent } from 'src/app/nomenclatoare/produse/produse-autocomplete/produse-autocomplete.component';
import { ProduseService } from 'src/app/nomenclatoare/produse/produse.service';
import { umDTO } from 'src/app/nomenclatoare/um/um-item/um.model';
import { UMService } from 'src/app/nomenclatoare/um/um.service';
import { produseComandaDTO } from '../comenzi-item/comenzi.model';

@Component({
  selector: 'app-comenzi-produse-autocomplete',
  templateUrl: './comenzi-produse-autocomplete.component.html',
  styleUrls: ['./comenzi-produse-autocomplete.component.scss']
})
export class ComenziProduseAutocompleteComponent implements OnInit {

  constructor(private activatedRoute: ActivatedRoute, private formBuilder:FormBuilder, 
    private produseService: ProduseService, private umService: UMService) { 
    this.selectedProdus = [];
    this.produsToDisplay = [];    
  }
  public form!: FormGroup;

  produsCtrl: FormControl = new FormControl();
  public furnizorFormGroup!: FormGroup;

  @Input()
  selectedProdus: produseComandaDTO[];
  produsToDisplay: produseComandaDTO[];
  umList: umDTO[]=[];
  @Output()
  onOptionSelected: EventEmitter<string> = new EventEmitter<string>();

  columnsToDisplay = ['produsNume', 'furnizorNume', 'cantitate', 'um', 'cutii', 'pretUm', 'valoare', 'discount', 'actions']

  @ViewChild(MatTable)
  table!: MatTable<any>;
  @ViewChild(ProduseAutocompleteComponent)
  produsAuto!: ProduseAutocompleteComponent;

  @ViewChild(FurnizoriAutocompleteComponent)
  furnizoriAuto!: FurnizoriAutocompleteComponent;

  perCutieSet!: number;
  pretSet!: number;

  ngOnInit(): void {
    console.log('selectedProdus in autocomplete:', this.selectedProdus);
    this.activatedRoute.params.subscribe(params=>{
      //alert(params.id);
    });
    console.log('lista produse', this.selectProdus);
    this.form = this.formBuilder.group({
      produsId:[null, {validators:[Validators.required]}],
      produsNume:'',
      furnizorId:[null,{validators:[Validators.required]}],
      furnizorNume:'',
      um: '',
      umId: ['', {validators:[Validators.required]}],
      cantitate: [null, {validators:[RxwebValidators.required(), RxwebValidators.numeric({acceptValue:NumericValueType.PositiveNumber  ,allowDecimal:true })]}],
      cutii: [null, {validators:[RxwebValidators.required(), RxwebValidators.numeric({acceptValue:NumericValueType.PositiveNumber  ,allowDecimal:true })]}],
      pretUm: [null, {validators:[RxwebValidators.required(), RxwebValidators.numeric({acceptValue:NumericValueType.PositiveNumber  ,allowDecimal:true })]}],
      valoare: [null, {validators:[RxwebValidators.required(), RxwebValidators.numeric({acceptValue:NumericValueType.PositiveNumber  ,allowDecimal:true })]}],
    });    
    
    this.loadProduseList();
    
    this.furnizorFormGroup = new FormGroup({
      furnizorId: new FormControl()
    });
    this.produsCtrl.valueChanges.subscribe(value => {
      this.produseService.searchByNameComanda(value).subscribe(produs => {
        this.produsToDisplay = produs;
      });
    })

    this.umService.getAll().subscribe(um=>{
      this.umList=um;
    })

  }

  loadProduseList(){
    this.produseService.getProduseAutocompleteComanda().subscribe(produse=>{
      this.produsToDisplay = produse;
    });    
  }
    
  selectFurnizor(furnizor: any){
    if(furnizor!==undefined){
     this.form.get('furnizorId')?.setValue(furnizor.id);
     this.form.get('furnizorNume')?.setValue(furnizor.nume);
    }
  }

  selectProdus(produs: any){    
    this.form.get('produsId')?.setValue(produs.id);
    this.form.get('produsNume')?.setValue(produs.nume);
    this.form.controls['pretUm']?.setValue(produs.pret);
    this.form.controls['umId']?.setValue(produs.umId);
    this.form.controls['um']?.setValue(produs.um);
    this.perCutieSet = produs.perCutie;
    this.pretSet = produs.pret;
 }

  private _filterStates(value: string): produseComandaDTO[] {
    const filterValue = value.toLowerCase();
    return this.produsToDisplay.filter(p => p.produsNume.toLowerCase().includes(filterValue));
  }

  saveChanges(){
    console.log('save produse', this.form.value);    
    this.selectedProdus.push(this.form.value);
    if (this.table !== undefined){
      this.table.renderRows();
    }
    this.form.reset();
    this.produsAuto.clearSelection();
    this.furnizoriAuto.clearSelection();
  }

  onCantitateChange(event: any){
    const cant = event.target.value;
    this.form.controls['cutii']?.setValue(Math.ceil(cant * this.perCutieSet??0));
    this.form.controls['valoare']?.setValue(cant * this.pretSet??0);
  }

  remove(produs:any){
    console.log('delete produs', produs);
    const index = this.selectedProdus.findIndex(a => a.produsId === produs.produsId);
    this.selectedProdus.splice(index, 1);
    this.table.renderRows();
  }

  selectUM(um: any){       
    this.form.get('um')?.setValue(um.source.triggerValue);
  }
  // dropped(event: CdkDragDrop<any[]>){
  //   const previousIndex = this.selectedProdus.findIndex(produs => produs === event.item.data);
  //   moveItemInArray(this.selectedProdus, previousIndex, event.currentIndex);
  //   this.table.renderRows();
  // }
  changeDiscountAll(discoutAll: HTMLInputElement){
    console.log('discoutAll:', discoutAll.value);
    this.selectedProdus.forEach(p=>p.discount = Number(discoutAll.value));    
  }
}
