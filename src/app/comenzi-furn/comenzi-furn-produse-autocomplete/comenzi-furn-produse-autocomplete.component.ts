import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { UntypedFormBuilder, UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { MatTable } from '@angular/material/table';
import { ActivatedRoute } from '@angular/router';
import { furnizoriDTO } from 'src/app/nomenclatoare/furnizori/furnizori-item/furnizori.model';
import { NumericValueType, RxwebValidators } from '@rxweb/reactive-form-validators';
import { ProduseAutocompleteComponent } from 'src/app/nomenclatoare/produse/produse-autocomplete/produse-autocomplete.component';
import { produseDTO } from 'src/app/nomenclatoare/produse/produse-item/produse.model';
import { ProduseService } from 'src/app/nomenclatoare/produse/produse.service';
import { umDTO } from 'src/app/nomenclatoare/um/um-item/um.model';
import { UMService } from 'src/app/nomenclatoare/um/um.service';
import { produseComandaFurnizorDTO } from '../comenzi-furn-item/comenzi-furn.model';
import { FurnizoriService } from 'src/app/nomenclatoare/furnizori/furnizori.service';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';

@Component({
  selector: 'app-comenzi-furn-produse-autocomplete',
  templateUrl: './comenzi-furn-produse-autocomplete.component.html',
  styleUrls: ['./comenzi-furn-produse-autocomplete.component.scss']
})
export class ComenziFurnProduseAutocompleteComponent implements OnInit {

  constructor(private activatedRoute: ActivatedRoute, private umService: UMService,
    private formBuilder:UntypedFormBuilder, private produseService: ProduseService) { 
    this.selectedProdus = [];
    //this.produsToDisplay = [];    
  }

  public form!: UntypedFormGroup;

  produsCtrl: UntypedFormControl = new UntypedFormControl();
  public furnizorFormGroup!: UntypedFormGroup;
  
  @Input() preselectedProdus:produseDTO|undefined;
  @Input() selectedProdus: produseComandaFurnizorDTO[];
  umList: umDTO[]=[];
  @Output()
  onOptionSelected: EventEmitter<string> = new EventEmitter<string>();

  columnsToDisplay = ['clientNume','codProdus', 'produsNume', 'cantitate', 'um', 'cutii', 'pretUm', 'valoare', 'disponibilitate', 'detalii', 'actions']

  @ViewChild(MatTable)
  table!: MatTable<any>;
  @ViewChild(ProduseAutocompleteComponent)
  produsAuto!: ProduseAutocompleteComponent;
  @ViewChild("cantitate") _cantitate!: ElementRef<HTMLInputElement>;
  
  perCutieSet!: number;
  pretSet!: number;
  isEditMode: boolean=false;

  ngOnInit(): void {
    this.activatedRoute.params.subscribe(params=>{      
    });
    this.form = this.formBuilder.group({
      produsId:[null, {validators:[Validators.required]}],
      produsNume:'',
      um: '',
      umId: ['', {validators:[Validators.required]}],
      cantitate: [null, {validators:[RxwebValidators.required(), RxwebValidators.numeric({acceptValue:NumericValueType.PositiveNumber  ,allowDecimal:true })]}],
      cutii: [null, {validators:[RxwebValidators.required(), RxwebValidators.numeric({acceptValue:NumericValueType.PositiveNumber  ,allowDecimal:true })]}],
      pretUm: [null, {validators:[RxwebValidators.required(), RxwebValidators.numeric({acceptValue:NumericValueType.PositiveNumber  ,allowDecimal:true })]}],
      valoare: [null, {validators:[RxwebValidators.required(), RxwebValidators.numeric({acceptValue:NumericValueType.PositiveNumber  ,allowDecimal:true })]}],
      //discount: [null, {validators:[RxwebValidators.numeric({acceptValue:NumericValueType.PositiveNumber  ,allowDecimal:true })]}],
      disponibilitate:[null],
      detalii:'', id:null, comenziFurnizorId:null, comenziProdusId:null, codProdus:'', clientNume:'', isCategory: false, sort: null
    });   
    
    
    this.umService.getAll().subscribe(um=>{
      this.umList=um;
    })
  }
  
  selectFurnizor(furnizor: any){
     this.form.get('furnizorId')?.setValue(furnizor.id);
     this.form.get('furnizorNume')?.setValue(furnizor.nume);
  }

  selectProdus(produs: any){    
    this.form.get('produsId')?.setValue(produs?.id);
    this.form.get('produsNume')?.setValue(produs?.nume);
    this.form.get('codProdus')?.setValue(produs?.cod);
    this.form.controls['pretUm']?.setValue(produs?.pret);
    this.form.controls['umId']?.setValue(produs?.umId);
    this.form.controls['um']?.setValue(produs?.um);
    this.perCutieSet = produs?.perCutie;
    this.pretSet = produs?.pret;
 }

  // private _filterStates(value: string): produseComandaFurnizorDTO[] {
  //   const filterValue = value.toLowerCase();
  //   return this.produsToDisplay.filter(p => p.produsNume.toLowerCase().includes(filterValue));
  // }

  saveChanges(){
    let index = this.selectedProdus.findIndex(a => a.id === Number(this.form.get('id')?.value));
      this.selectedProdus[index]=this.form.value;
      
    if (this.table !== undefined){
      this.table.renderRows();
    }
    this.form.reset();
    this.produsAuto.clearSelection();
  }

  onCantitateChange(event: any){    
    var cantInt = Number(event.target.value??0) * 1000;
    var perCutieInt = Number(this.perCutieSet) * 1000 ;
    var cantDecimal = (Math.ceil(cantInt / perCutieInt) * perCutieInt) / 1000;
    var cutii = Math.ceil(cantInt / perCutieInt);
    var valoareDecimal = ((Math.ceil(cantInt / perCutieInt) * perCutieInt) * (Number(this.form.controls['pretUm'].value) * 100)) / 100000;
    if(cantInt == null){
      this.form.controls['cutii']?.setValue('');
      this.form.controls['valoare']?.setValue('');
    }else{      
      this.form.controls['cantitate']?.setValue(cantDecimal);
      this.form.controls['cutii']?.setValue(cutii??0);
      this.form.controls['valoare']?.setValue((Math.round((valoareDecimal + Number.EPSILON) * 1000) / 1000)??0);
    }
  }
  onPretChange(event: any){
    const pret = event.target.value;
    var val = Number(pret * this.form.controls['cantitate'].value??0)
    if(pret == ''){
      this.form.controls['valoare']?.setValue('');
    }
    else{
      this.form.controls['valoare']?.setValue((Math.round((val + Number.EPSILON) * 1000) / 1000)??0);
    }
  }

  edit(produs:any){    
    this.form.setValue(produs);
    this.produseService.getById(produs.produsId).subscribe(produs=>{
      this.preselectedProdus = produs;
      this.perCutieSet = produs.perCutie;
      this.pretSet = produs.pret;
    });    
    this.isEditMode = true;
    this._cantitate.nativeElement.focus();
  }

  clearForm(){
    this.form.reset();
    this.produsAuto.clearSelection();
    this.isEditMode = false; 
  }
  selectUM(um: any){       
    this.form.get('um')?.setValue(um.source.triggerValue);
  }
  remove(produs:any){
    const index = this.selectedProdus.findIndex(a => a.produsId === produs.produsId);
    this.selectedProdus.splice(index, 1);
    this.table.renderRows();
  }  
  dropped(event: CdkDragDrop<any[]>){
    const previousIndex = this.selectedProdus.findIndex(produs => produs === event.item.data);
    moveItemInArray(this.selectedProdus, previousIndex, event.currentIndex);
    this.table.renderRows();
  }
}
