import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { Component, ElementRef, EventEmitter, Input, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, FormsModule, Validators  } from '@angular/forms';
import { MatTable } from '@angular/material/table';
import { ActivatedRoute } from '@angular/router';
import { NumericValueType, RxwebValidators } from '@rxweb/reactive-form-validators';
import { takeUntil } from 'rxjs/operators';
import { FurnizoriAutocompleteComponent } from 'src/app/nomenclatoare/furnizori/furnizori-autocomplete/furnizori-autocomplete.component';
import { furnizoriDTO } from 'src/app/nomenclatoare/furnizori/furnizori-item/furnizori.model';
import { FurnizoriService } from 'src/app/nomenclatoare/furnizori/furnizori.service';
import { ProduseAutocompleteComponent } from 'src/app/nomenclatoare/produse/produse-autocomplete/produse-autocomplete.component';
import { produseDTO, produseOfertaDTO } from 'src/app/nomenclatoare/produse/produse-item/produse.model';
import { ProduseService } from 'src/app/nomenclatoare/produse/produse.service';
import { umDTO } from 'src/app/nomenclatoare/um/um-item/um.model';
import { UMService } from 'src/app/nomenclatoare/um/um.service';
import { UnsubscribeService } from 'src/app/unsubscribe.service';
import { CookieService } from 'src/app/utilities/cookie.service';

@Component({
  selector: 'app-oferte-produse-autocomplete',
  templateUrl: './oferte-produse-autocomplete.component.html',
  styleUrls: ['./oferte-produse-autocomplete.component.scss']
})
export class OferteProduseAutocompleteComponent implements OnInit, OnDestroy {

  constructor(private activatedRoute: ActivatedRoute, private formBuilder:FormBuilder, public cookie: CookieService, 
    private unsubscribeService: UnsubscribeService,
    private produseService: ProduseService, private umService: UMService, private furnizorService: FurnizoriService) { 
    this.selectedProdus = [];
    this.produsToDisplay = [];    
  }
  public form!: FormGroup;
  public formDoarNecomandate!: FormGroup;

  produsCtrl: FormControl = new FormControl();
  public furnizorFormGroup!: FormGroup;

  @Input() preselectedProdus:produseDTO|undefined;
  @Input() preselectFurnizor:furnizoriDTO|undefined;
  @Input() selectedProdus: produseOfertaDTO[];
  @Input() idOferta: number|undefined;
  produsToDisplay: produseOfertaDTO[];
  umList: umDTO[]=[];
  selectedProdusFiltered: produseOfertaDTO[]=[];

  @Output()
  onOptionSelected: EventEmitter<string> = new EventEmitter<string>();

  columnsToDisplay = ['codProdus', 'produsNume', 'furnizorNume', 'cantitate', 'um', 'cutii', 'pretUm', 'discount', 'valoare', 'actions']

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
    this.form = this.formBuilder.group({
      produsId:[null, {validators:[Validators.required]}],
      produsNume:'',
      furnizorId:[null],
      furnizorNume:'',
      um: '',
      umId: ['', {validators:[Validators.required]}],
      cantitate: [null, {validators:[RxwebValidators.required({conditionalExpression:(x: any) => x.isCategory == false  }), RxwebValidators.numeric({acceptValue:NumericValueType.Both  ,allowDecimal:true })]}],
      cutii: [null, {validators:[RxwebValidators.required({conditionalExpression:(x: any) => x.isCategory == false  }), RxwebValidators.numeric({acceptValue:NumericValueType.Both  ,allowDecimal:true })]}],
      pretUm: [null, {validators:[RxwebValidators.required({conditionalExpression:(x: any) => x.isCategory == false  }), RxwebValidators.numeric({acceptValue:NumericValueType.Both  ,allowDecimal:true })]}],
      valoare: [null, {validators:[RxwebValidators.required({conditionalExpression:(x: any) => x.isCategory == false  }), RxwebValidators.numeric({acceptValue:NumericValueType.Both  ,allowDecimal:true })]}],
      discount: null, 
      codProdus:'', id:null, isInComanda:false, isCategory: false, sort: null, isStoc: false, discountValoare: null
    });
    this.formDoarNecomandate = this.formBuilder.group({
      doarNecomandate: this.idOferta ? this.cookie.getCookie('oferta' + this.idOferta)== '' ? false: this.cookie.getCookie('oferta' + this.idOferta) : false,
    });
    this.formDoarNecomandate.controls['doarNecomandate'].valueChanges.subscribe(value => {
      this.cookie.setCookie({name:'oferta' + this.idOferta, value, session: true});

      if(value){
        this.selectedProdusFiltered = this.selectedProdus.filter(p=>p.isInComanda == false);
      }
      else this.selectedProdusFiltered = this.selectedProdus.filter(p=>p.isInComanda == true || p.isInComanda == false);
    });

    if(this.cookie.getCookie('oferta' + this.idOferta)){
      this.selectedProdusFiltered = this.selectedProdus.filter(p=>p.isInComanda == false);
    }
    else this.selectedProdusFiltered = this.selectedProdus.filter(p=>p.isInComanda == true || p.isInComanda == false);

    this.loadProduseList();
    
    this.furnizorFormGroup = new FormGroup({
      furnizorId: new FormControl()
    });

    this.produsCtrl.valueChanges.subscribe(value => {
      this.produseService.searchByName(value)
      .pipe(takeUntil(this.unsubscribeService.unsubscribeSignal$))
      .subscribe(produs => {
        this.produsToDisplay = produs;
      });
    });

    this.umService.getAll()
    .pipe(takeUntil(this.unsubscribeService.unsubscribeSignal$))
    .subscribe(um=>{
      this.umList=um;
    });
  }

  loadProduseList(){
    this.produseService.getProduseAutocomplete()
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
    //reset some values
    this.form.controls['cantitate']?.setValue(null);
    this.form.controls['cutii']?.setValue(null);
    this.form.controls['valoare']?.setValue(null);

    this.form.get('produsId')?.setValue(produs?.id);
    this.form.get('produsNume')?.setValue(produs?.nume);
    this.form.get('codProdus')?.setValue(produs?.cod);
    if(produs != undefined && produs.prefFurnizorId !=undefined){      
      this.form.get('furnizorId')?.setValue(produs.prefFurnizorId);
      this.form.get('furnizorNume')?.setValue(produs.prefFurnizor);
      this.furnizorService.getById(produs.prefFurnizorId)
      .pipe(takeUntil(this.unsubscribeService.unsubscribeSignal$))
      .subscribe(furnizor=>{
        this.preselectFurnizor = furnizor;
      });
    }
    this.form.controls['pretUm']?.setValue(produs?.pret);
    this.form.controls['umId']?.setValue(produs?.umId);
    this.form.controls['um']?.setValue(produs?.um);
    this.form.controls['isCategory']?.setValue(produs?.isCategory);
    this.perCutieSet = produs?.perCutie;
    this.pretSet = produs?.pret;
 }

  selectUM(um: any){   
    this.form.get('um')?.setValue(um.source.triggerValue);
  }

  private _filterStates(value: string): produseOfertaDTO[] {
    const filterValue = value.toLowerCase();
    return this.produsToDisplay.filter(p => p.produsNume.toLowerCase().includes(filterValue));
  }

  saveChanges(){
    if(this.form.get('id')?.value !=null && this.isEditMode){
      let index = this.selectedProdusFiltered.findIndex(a => a.id === Number(this.form.get('id')?.value));
      this.selectedProdusFiltered[index]=this.form.value;

      let index2 = this.selectedProdus.findIndex(a => a.id === Number(this.form.get('id')?.value));
      this.selectedProdus[index2]=this.form.value;
    }
    else {
      this.selectedProdusFiltered.push(this.form.value);
      this.selectedProdus.push(this.form.value);
    }    

    if (this.table !== undefined){
      this.table.renderRows();
    }
    this.form.reset();
    this.produsAuto.clearSelection();
    this.furnizoriAuto.clearSelection();
    this.isEditMode = false;
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
    if(produs.furnizorId > 0){
      this.furnizorService.getById(produs.furnizorId)
      .pipe(takeUntil(this.unsubscribeService.unsubscribeSignal$))
      .subscribe(furnizor=>{
        this.preselectFurnizor = furnizor;
      });
    }
    this.isEditMode = true;
    this._cantitate.nativeElement.focus();
  }
  clearForm(){
    this.form.reset();
    this.produsAuto.clearSelection();
    this.furnizoriAuto.clearSelection();
    this.isEditMode = false; 
  }
  onCantitateChange(event: any){
    var cantInt = Number(event.target.value??0) * 1000;
    var perCutieInt = Number(this.perCutieSet) * 1000 ;
    var cantDecimal = (Math.ceil(cantInt / perCutieInt) * perCutieInt) / 1000;
    var cutii = Math.ceil(cantInt / perCutieInt);
    var valoareDecimal = ((Math.ceil(cantInt / perCutieInt) * perCutieInt) * (Number(this.form.controls['pretUm'].value) * 100)) / 100000;
    var discount = this.form.controls['discount'].value??0;
    valoareDecimal = discount > 0 ? valoareDecimal - (valoareDecimal * discount / 100) : valoareDecimal;
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
    const pret = this.form.controls['pretUm'].value??0;    
    const discount = this.form.controls['discount'].value??0;    
    var val = Number(pret * this.form.controls['cantitate'].value??0);
    val = discount > 0 ? val - (val * discount / 100) : val;
    if(pret == ''){
      this.form.controls['valoare']?.setValue('');
    }
    else{
      this.form.controls['valoare']?.setValue(Math.round((val + Number.EPSILON) * 1000) / 1000);
    }
  }
  getTotalCost() {
    return this.selectedProdusFiltered.map(t => t.valoare).reduce((acc, value) => Number(acc) + Number(value), 0);
  }
  getTotalBox() {
    return this.selectedProdusFiltered.map(t => t.cutii).reduce((acc, value) => Number(acc) + Number(value), 0);
  }
  remove(produs:any){
    console.log('delete produs', produs);
    const index = this.selectedProdusFiltered.findIndex(a => a.id === produs.id);
    this.selectedProdusFiltered.splice(index, 1);
    
    const index2 = this.selectedProdus.findIndex(a => a.id === produs.id);
    this.selectedProdus.splice(index2, 1);
    this.table.renderRows();
  }

  dropped(event: CdkDragDrop<any[]>){
    const previousIndex = this.selectedProdusFiltered.findIndex(produs => produs === event.item.data);
    moveItemInArray(this.selectedProdusFiltered, previousIndex, event.currentIndex);
    this.table.renderRows();

    const previousIndex2 = this.selectedProdus.findIndex(produs => produs === event.item.data);
    moveItemInArray(this.selectedProdus, previousIndex2, event.currentIndex);
  }

  changeDiscountAll(discoutAll: HTMLInputElement){    
    this.selectedProdusFiltered.forEach(p=> {p.discount = Number(discoutAll.value), p.valoare = (p.pretUm * p.cantitate) - ((p.pretUm * p.cantitate) * Number(discoutAll.value) / 100)});    
  }

  ngOnDestroy(): void {}
}

