import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatTable } from '@angular/material/table';
import { ActivatedRoute } from '@angular/router';
import { NumericValueType, RxwebValidators } from '@rxweb/reactive-form-validators';
import { FurnizoriAutocompleteComponent } from 'src/app/nomenclatoare/furnizori/furnizori-autocomplete/furnizori-autocomplete.component';
import { furnizoriDTO } from 'src/app/nomenclatoare/furnizori/furnizori-item/furnizori.model';
import { FurnizoriService } from 'src/app/nomenclatoare/furnizori/furnizori.service';
import { ProduseAutocompleteComponent } from 'src/app/nomenclatoare/produse/produse-autocomplete/produse-autocomplete.component';
import { produseDTO } from 'src/app/nomenclatoare/produse/produse-item/produse.model';
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
    private produseService: ProduseService, private umService: UMService, private furnizorService: FurnizoriService) { 
    this.selectedProdus = [];
    this.produsToDisplay = [];    
  }
  public form!: FormGroup;

  produsCtrl: FormControl = new FormControl();
  public furnizorFormGroup!: FormGroup;

  @Input() preselectedProdus:produseDTO|undefined;
  @Input() preselectFurnizor:furnizoriDTO|undefined;
  @Input() selectedProdus: produseComandaDTO[];
  produsToDisplay: produseComandaDTO[];
  umList: umDTO[]=[];
  @Output()
  onOptionSelected: EventEmitter<string> = new EventEmitter<string>();
  
  columnsToDisplay = ['codProdus', 'produsNume', 'furnizorNume', 'cantitate', 'um', 'cutii', 'pretUm', 'valoare', 'discount', 'actions']

  @ViewChild(MatTable)
  table!: MatTable<any>;
  @ViewChild(ProduseAutocompleteComponent)
  produsAuto!: ProduseAutocompleteComponent;

  @ViewChild(FurnizoriAutocompleteComponent)
  furnizoriAuto!: FurnizoriAutocompleteComponent;
  @ViewChild("cantitate") _cantitate!: ElementRef<HTMLInputElement>;

  perCutieSet!: number;
  pretSet!: number;
  isEditMode: boolean=false;

  ngOnInit(): void {
    console.log('selectedProdus in autocomplete:', this.selectedProdus);
    this.activatedRoute.params.subscribe(params=>{
      //alert(params.id);
    });
    console.log('lista produse', this.selectProdus);
    this.form = this.formBuilder.group({
      produsId:[null, {validators:[Validators.required]}],
      produsNume:'',      
      furnizorId:[null,{validators:[RxwebValidators.required({conditionalExpression:(x: any) => x.isCategory == false  })]}],
      furnizorNume:'',
      um: '',
      umId: ['', {validators:[RxwebValidators.required()]}],
      cantitate: [null, {validators:[RxwebValidators.required({conditionalExpression:(x: any) => x.isCategory == false  }), RxwebValidators.numeric({acceptValue:NumericValueType.PositiveNumber  ,allowDecimal:true })]}],
      cutii: [null, {validators:[RxwebValidators.required({conditionalExpression:(x: any) => x.isCategory == false  }), RxwebValidators.numeric({acceptValue:NumericValueType.PositiveNumber  ,allowDecimal:true })]}],
      pretUm: [null, {validators:[RxwebValidators.required({conditionalExpression:(x: any) => x.isCategory == false  }), RxwebValidators.numeric({acceptValue:NumericValueType.PositiveNumber  ,allowDecimal:true })]}],
      valoare: [null, {validators:[RxwebValidators.required({conditionalExpression:(x: any) => x.isCategory == false  }), RxwebValidators.numeric({acceptValue:NumericValueType.PositiveNumber  ,allowDecimal:true })]}],
      discount: null,
      codProdus:'',
      id: null, oferteProdusId:null, isInComandaFurnizor: false, disponibilitate:null, isCategory: false, depozit:null, sort: null, isStoc: false
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
    this.form.get('codProdus')?.setValue(produs.cod);
    if(produs.prefFurnizorId !=undefined){
      console.log('prefFurnizor', produs.prefFurnizor);    
      this.form.get('furnizorId')?.setValue(produs.prefFurnizorId);
      this.form.get('furnizorNume')?.setValue(produs.prefFurnizor);
      this.furnizorService.getById(produs.prefFurnizorId).subscribe(furnizor=>{
        this.preselectFurnizor = furnizor;
      });
    }
    this.form.controls['pretUm']?.setValue(produs.pret);
    this.form.controls['umId']?.setValue(produs.umId);
    this.form.controls['um']?.setValue(produs.um);
    this.form.controls['isCategory']?.setValue(produs.isCategory);
    this.perCutieSet = produs.perCutie;
    this.pretSet = produs.pret;
 }

  private _filterStates(value: string): produseComandaDTO[] {
    const filterValue = value.toLowerCase();
    return this.produsToDisplay.filter(p => p.produsNume.toLowerCase().includes(filterValue));
  }

  saveChanges(){
    if(this.form.get('id')?.value !=null && this.isEditMode){
      let index = this.selectedProdus.findIndex(a => a.id === Number(this.form.get('id')?.value));
      this.selectedProdus[index]=this.form.value;
    }
    else this.selectedProdus.push(this.form.value);

    if (this.table !== undefined){
      this.table.renderRows();
    }
    this.form.reset();
    this.produsAuto.clearSelection();
    this.furnizoriAuto.clearSelection();
    this.isEditMode = false;
  }

  onCantitateChange(event: any){
    const cant = event.target.value;
    if(cant == ''){
      this.form.controls['cutii']?.setValue('');
      this.form.controls['valoare']?.setValue('');
    }else{
      this.form.controls['cutii']?.setValue(Math.ceil(cant / this.perCutieSet)??0);
      this.form.controls['valoare']?.setValue(cant * this.form.controls['pretUm'].value??this.pretSet??0);
    }
  }
  onPretChange(event: any){
    const pret = event.target.value;
    if(pret == ''){
      this.form.controls['valoare']?.setValue('');
    }
    else{
      this.form.controls['valoare']?.setValue(Number(pret) * Number(this.form.controls['cantitate'].value??0));
    }
  }
  getTotalCost() {
    return this.selectedProdus.map(t => t.valoare).reduce((acc, value) => Number(acc) + Number(value), 0);
  }
  getTotalWithDiscountCost() {
    return this.selectedProdus.map(t => t.valoare - (t.valoare * t.discount / 100)).reduce((acc, value) => Number(acc) + Number(value), 0);
  }
  getTotalBox() {
    return this.selectedProdus.map(t => t.cutii).reduce((acc, value) => Number(acc) + Number(value), 0);
  }
  remove(produs:any){
    console.log('delete produs', produs);
    const index = this.selectedProdus.findIndex(a => a.produsId === produs.produsId);
    this.selectedProdus.splice(index, 1);
    this.table.renderRows();
  }
  edit(produs:any){
    console.log('produs', produs);
    this.form.setValue(produs);
    this.produseService.getById(produs.produsId).subscribe(produs=>{
      this.preselectedProdus = produs;
      this.perCutieSet = produs.perCutie;
      this.pretSet = produs.pret;
    });
    if(produs.furnizorId == null)this.preselectFurnizor = undefined;
    else{
      this.furnizorService.getById(produs.furnizorId).subscribe(furnizor=>{
        this.preselectFurnizor = furnizor;
      });      
    }
    this.isEditMode = true;
    this._cantitate.nativeElement.focus();
    //this._cantitate.nativeElement.scrollIntoView({block: "start", inline: "start"});
    //window.scroll(0,0);
  }
  clearForm(){
    this.form.reset();
    this.produsAuto.clearSelection();
    this.furnizoriAuto.clearSelection();
    this.isEditMode = false; 
  }
  selectUM(um: any){       
    this.form.get('um')?.setValue(um.source.triggerValue);
  }
  dropped(event: CdkDragDrop<any[]>){
    const previousIndex = this.selectedProdus.findIndex(produs => produs === event.item.data);
    moveItemInArray(this.selectedProdus, previousIndex, event.currentIndex);
    this.table.renderRows();
  }
  changeDiscountAll(discoutAll: HTMLInputElement){
    console.log('discoutAll:', discoutAll.value);
    this.selectedProdus.forEach(p=>p.discount = Number(discoutAll.value));    
  }
}
