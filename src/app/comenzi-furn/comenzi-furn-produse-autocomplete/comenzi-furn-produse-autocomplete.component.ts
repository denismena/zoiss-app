import { Component, ElementRef, EventEmitter, Input, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatTable } from '@angular/material/table';
import { ActivatedRoute } from '@angular/router';
import { NumericValueType, RxwebValidators } from '@rxweb/reactive-form-validators';
import { ProduseAutocompleteComponent } from 'src/app/nomenclatoare/produse/produse-autocomplete/produse-autocomplete.component';
import { produseDTO } from 'src/app/nomenclatoare/produse/produse-item/produse.model';
import { ProduseService } from 'src/app/nomenclatoare/produse/produse.service';
import { umDTO } from 'src/app/nomenclatoare/um/um-item/um.model';
import { UMService } from 'src/app/nomenclatoare/um/um.service';
import { produseComandaFurnizorDTO } from '../comenzi-furn-item/comenzi-furn.model';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { MatDialog } from '@angular/material/dialog';
import { ProdusSplitDialogComponent } from '../produs-split-dialog/produs-split-dialog.component';
import { UnsubscribeService } from 'src/app/unsubscribe.service';
import { takeUntil } from 'rxjs/operators';

@Component({
    selector: 'app-comenzi-furn-produse-autocomplete',
    templateUrl: './comenzi-furn-produse-autocomplete.component.html',
    styleUrls: ['./comenzi-furn-produse-autocomplete.component.scss'],
    standalone: false
})
export class ComenziFurnProduseAutocompleteComponent implements OnInit, OnDestroy {

  constructor(private umService: UMService, private unsubscribeService: UnsubscribeService,
    private formBuilder:FormBuilder, private produseService: ProduseService, public dialog: MatDialog) { 
    this.selectedProdus = [];
    //this.produsToDisplay = [];    
  }

  public form!: FormGroup;

  produsCtrl: FormControl = new FormControl();
  public furnizorFormGroup!: FormGroup;
  
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
      detalii:'', id:null, comenziFurnizorId:null, comenziProdusId:null, codProdus:'', clientNume:'', isCategory: false, isInTransport: false, sort: null
    });   
    
    
    this.umService.getAll()
    .pipe(takeUntil(this.unsubscribeService.unsubscribeSignal$))
    .subscribe(um=>{
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
      this.form.controls['valoare']?.setValue(Math.round((valoareDecimal + Number.EPSILON) * 1000) / 1000);
    }
  }
  onPretChange(event: any){
    const pret = event.target.value;
    var val = Number(pret * this.form.controls['cantitate'].value)
    if(pret == ''){
      this.form.controls['valoare']?.setValue('');
    }
    else{
      this.form.controls['valoare']?.setValue(Math.round((val + Number.EPSILON) * 1000) / 1000);
    }
  }

  edit(produs:any){    
    this.form.setValue(produs);
    this.produseService.getById(produs.produsId)
    .pipe(takeUntil(this.unsubscribeService.unsubscribeSignal$))
    .subscribe(produs=>{
      this.preselectedProdus = produs;
      this.perCutieSet = produs.perCutie;
      this.pretSet = produs.pret;
    });    
    this.isEditMode = true;
    //this._cantitate.nativeElement.focus();
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
    const index = this.selectedProdus.findIndex(a => a.id === produs.id && a.produsId === produs.produsId);
    this.selectedProdus.splice(index, 1);
    this.table.renderRows();
  }
  
  split(produs:any){
    let oldCutiiValue = produs.cutii;
    let oldCantitateValue = produs.cantitate;
    let oldValoareValue = produs.valoare;
    const dialogRef = this.dialog.open(ProdusSplitDialogComponent,      
      { data:{produsSplit: produs}, width: '650px', height: '300px' });
      dialogRef.afterClosed()
      .pipe(takeUntil(this.unsubscribeService.unsubscribeSignal$))
      .subscribe((data:any) => {
        if (data.clicked === 'submit') {
          const anotherProdus : produseComandaFurnizorDTO = {
            ...data.form,
            id: 0,
            isInTransport:0
          }
          for (let object of this.selectedProdus) {
            if (object.id === produs.id) {
                object.cutii = oldCutiiValue - anotherProdus.cutii;
                object.cantitate = oldCantitateValue - anotherProdus.cantitate;
                object.valoare = oldValoareValue - anotherProdus.valoare;
            }
          }
          this.selectedProdus.push(anotherProdus);
          
          if (this.table !== undefined){      
            this.table.renderRows();
          }          
        }
      });    
  }  
  dropped(event: CdkDragDrop<any[]>){
    const previousIndex = this.selectedProdus.findIndex(produs => produs === event.item.data);
    moveItemInArray(this.selectedProdus, previousIndex, event.currentIndex);
    this.table.renderRows();
  }

  ngOnDestroy(): void {}
}
