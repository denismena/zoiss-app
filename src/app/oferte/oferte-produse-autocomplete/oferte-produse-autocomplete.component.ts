import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, FormsModule, Validators  } from '@angular/forms';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { MatTable } from '@angular/material/table';
import { ActivatedRoute } from '@angular/router';
import {Observable} from 'rxjs';
import {map, startWith} from 'rxjs/operators';
import { produseDTO, produseOfertaDTO } from 'src/app/nomenclatoare/produse/produse-item/produse.model';
import { ProduseService } from 'src/app/nomenclatoare/produse/produse.service';

@Component({
  selector: 'app-oferte-produse-autocomplete',
  templateUrl: './oferte-produse-autocomplete.component.html',
  styleUrls: ['./oferte-produse-autocomplete.component.scss']
})
export class OferteProduseAutocompleteComponent implements OnInit {

  // produse: produseDTO[]
  constructor(private activatedRoute: ActivatedRoute, private formBuilder:FormBuilder, private produseService: ProduseService) { 
    // this.produse = [];
    this.selectedProdus = [];
    this.produsToDisplay = [];

    // this.selectedProdus = this.produsCtrl.valueChanges
    //   .pipe(
    //     startWith(''),
    //     map(state => state ? this._filterStates(state) : this.produse.slice())
    //   );    
  }
  public form!: FormGroup;

  produsCtrl: FormControl = new FormControl();
  public furnizorFormGroup!: FormGroup;

  @Input()
  selectedProdus: produseOfertaDTO[];
  produsToDisplay: produseOfertaDTO[];
  @Output()
  onOptionSelected: EventEmitter<string> = new EventEmitter<string>();

  columnsToDisplay = ['produsNume', 'furnizorNume', 'cantitate', 'um', 'cutii', 'pretUm', 'valoare', 'actions']

  @ViewChild(MatTable)
  table!: MatTable<any>;

  
  ngOnInit(): void {

    this.activatedRoute.params.subscribe(params=>{
      //alert(params.id);
    });


    this.form = this.formBuilder.group({
      produsId:[null, {validators:[Validators.required]}],
      produsNume:'',
      furnizorId:[null],
      furnizorNume:'',
      um: ['', {validators:[Validators.required]}],
      cantitate: [null, {validators:[Validators.required]}],
      cutii: [null, {validators:[Validators.required]}],
      pretUm: [null, {validators:[Validators.required]}],
      valoare: [null, {validators:[Validators.required]}],
    });    
    
    // if(this.model !== undefined)
    // {
    //   this.form.patchValue(this.model);
    // }    
    
    this.loadProduseList();
    
    this.furnizorFormGroup = new FormGroup({
      furnizorId: new FormControl()
    });
    this.produsCtrl.valueChanges.subscribe(value => {
      this.produseService.searchByName(value).subscribe(produs => {
        this.produsToDisplay = produs;
      });
    })    
  }

  loadProduseList(){
    this.produseService.getProduseAutocomplete().subscribe(produse=>{
      this.produsToDisplay = produse;
    });    
  }

  // optionSelected(event: MatAutocompleteSelectedEvent){    
  //   this.form.get('id')?.setValue(event.option.value);
  // }

  selectFurnizor(furnizor: any){    
     this.form.get('furnizorId')?.setValue(furnizor.id);
     this.form.get('furnizorNume')?.setValue(furnizor.nume);
  }

  selectProdus(produs: any){    
    this.form.get('produsId')?.setValue(produs.id);
    this.form.get('produsNume')?.setValue(produs.nume);
 }

  private _filterStates(value: string): produseOfertaDTO[] {
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
  }

  remove(produs:any){
    console.log('delete produs', produs);
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

