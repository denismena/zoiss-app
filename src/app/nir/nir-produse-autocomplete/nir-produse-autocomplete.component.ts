import { Component, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { furnizoriDTO } from 'src/app/nomenclatoare/furnizori/furnizori-item/furnizori.model';
import { FurnizoriService } from 'src/app/nomenclatoare/furnizori/furnizori.service';
import { produseDTO } from 'src/app/nomenclatoare/produse/produse-item/produse.model';
import { ProduseService } from 'src/app/nomenclatoare/produse/produse.service';
import { UMService } from 'src/app/nomenclatoare/um/um.service';
import { UnsubscribeService } from 'src/app/unsubscribe.service';
import { produseNirDTO } from '../nir-item/nir.model';
import { umDTO } from 'src/app/nomenclatoare/um/um-item/um.model';
import { NumericValueType, RxwebValidators } from '@rxweb/reactive-form-validators';
import { takeUntil } from 'rxjs/operators';
import { MatTable } from '@angular/material/table';
import { ProduseAutocompleteComponent } from 'src/app/nomenclatoare/produse/produse-autocomplete/produse-autocomplete.component';
import { FurnizoriAutocompleteComponent } from 'src/app/nomenclatoare/furnizori/furnizori-autocomplete/furnizori-autocomplete.component';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';

@Component({
  selector: 'app-nir-produse-autocomplete',
  templateUrl: './nir-produse-autocomplete.component.html',
  styleUrls: ['./nir-produse-autocomplete.component.scss']
})
export class NirProduseAutocompleteComponent {
  @Input() preselectedProdus:produseDTO|undefined;
  @Input() preselectFurnizor:furnizoriDTO|undefined;
  @Input() selectedProdus: produseNirDTO[];
  @Output() onOptionSelected: EventEmitter<string> = new EventEmitter<string>();
  @ViewChild(MatTable) table!: MatTable<any>;
  @ViewChild(ProduseAutocompleteComponent) produsAuto!: ProduseAutocompleteComponent;
  @ViewChild(FurnizoriAutocompleteComponent) furnizoriAuto!: FurnizoriAutocompleteComponent;

  public form!: FormGroup;
  produsCtrl: FormControl = new FormControl();
  public furnizorFormGroup!: FormGroup;  
  columnsToDisplay = ['codProdus', 'produsNume', 'furnizorNume', 'cantitate', 'um', 'actions']
  produsToDisplay: produseNirDTO[];
  umList: umDTO[]=[];
  isEditMode: boolean=false;

  constructor(private formBuilder:FormBuilder, private unsubscribeService: UnsubscribeService, 
    private produseService: ProduseService, private umService: UMService, private furnizorService: FurnizoriService) { 
    this.selectedProdus = [];
    this.produsToDisplay = [];    
  }

  ngOnInit(): void {
    this.form = this.formBuilder.group({
      furnizorId:[null, {validators:[Validators.required]}],
      furnizorNume:'',
      produsId:[null, {validators:[Validators.required]}],
      produsNume:'',
      codProdus:'',
      umId:[null, {validators:[Validators.required]}],
      um:'',
      cantitate:[null, {validators:[RxwebValidators.numeric({ acceptValue: NumericValueType.Both, allowDecimal: true }), RxwebValidators.required()]} ],
      id:null, nirId:null, sort:null
    });

    this.loadProduseList();
    
    this.furnizorFormGroup = new FormGroup({
      furnizorId: new FormControl()
    });
    this.produsCtrl.valueChanges.subscribe(value => {
      this.produseService.searchByNameComanda(value)
      .pipe(takeUntil(this.unsubscribeService.unsubscribeSignal$))
      .subscribe(produs => {
        this.produsToDisplay = produs;
      });
    })

    this.umService.getAll()
    .pipe(takeUntil(this.unsubscribeService.unsubscribeSignal$))
    .subscribe(um=>{
      this.umList=um;
    })
  }

  loadProduseList(){
    this.produseService.getProduseAutocompleteComanda()
    .pipe(takeUntil(this.unsubscribeService.unsubscribeSignal$))
    .subscribe(produse=>{
      this.produsToDisplay = produse;
    });    
  }

  selectFurnizor(furnizor: any){
    this.form.get('furnizorId')?.setValue(furnizor?.id);
    this.form.get('furnizorNume')?.setValue(furnizor?.nume);
  }

  selectProdus(produs: any){
    this.form.get('produsId')?.setValue(produs?.id);
    this.form.get('produsNume')?.setValue(produs?.nume);
    this.form.get('codProdus')?.setValue(produs?.cod);
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

  remove(produs:any){
    const index = this.selectedProdus.findIndex(a => a.id === produs.id);
    this.selectedProdus.splice(index, 1);
    this.table.renderRows();
  }

  edit(produs:any){
    // Remove the 'isLivrat' property from produs
    //delete produs.isLivrat;
    //produs.produsStocValoare = produs.produsStocValoare;
    this.form.setValue(produs);
    this.produseService.getById(produs.produsId)
    .pipe(takeUntil(this.unsubscribeService.unsubscribeSignal$))
    .subscribe(produs=>{
      this.preselectedProdus = produs;
      //this.perCutieSet = produs.perCutie;
      //this.pretSet = produs.pret;
    });
    if(produs.furnizorId == null)this.preselectFurnizor = undefined;
    else{
      this.furnizorService.getById(produs.furnizorId)
      .pipe(takeUntil(this.unsubscribeService.unsubscribeSignal$))
      .subscribe(furnizor=>{
        this.preselectFurnizor = furnizor;
      });      
    }
    this.isEditMode = true;
    //this._cantitate.nativeElement.focus();    
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

  ngOnDestroy(): void {}
  
}
