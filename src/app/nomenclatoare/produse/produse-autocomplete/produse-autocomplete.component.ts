import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { FormControl, FormGroup, FormsModule  } from '@angular/forms';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { MatTable } from '@angular/material/table';
import {Observable} from 'rxjs';
import {map, startWith} from 'rxjs/operators';
import { produseDTO, produseOfertaDTO } from '../produse-item/produse.model';
import { ProduseService } from '../produse.service';

@Component({
  selector: 'app-produse-autocomplete',
  templateUrl: './produse-autocomplete.component.html',
  styleUrls: ['./produse-autocomplete.component.scss']
})
export class ProduseAutocompleteComponent implements OnInit {

  // produse: produseDTO[]
  constructor(private produseService: ProduseService) { 
    // this.produse = [];
    this.selectedProdus = [];
    this.produsToDisplay = [];

    // this.selectedProdus = this.produsCtrl.valueChanges
    //   .pipe(
    //     startWith(''),
    //     map(state => state ? this._filterStates(state) : this.produse.slice())
    //   );    
  }
  produsCtrl: FormControl = new FormControl();
  public furnizorFormGroup!: FormGroup;

  @Input()
  selectedProdus: produseOfertaDTO[];
  produsToDisplay: produseOfertaDTO[];
  @Output()
  onOptionSelected: EventEmitter<string> = new EventEmitter<string>();

  columnsToDisplay = ['poza', 'produsNume', 'furnizorId', 'cantitate', 'um', 'cutii', 'pretUm', 'valoare', 'actions']

  @ViewChild(MatTable)
  table!: MatTable<any>;

  
  ngOnInit(): void {
    //this.loadProduseList();
    this.furnizorFormGroup = new FormGroup({
      furnizorId: new FormControl()
    });
    this.produsCtrl.valueChanges.subscribe(value => {
      this.produseService.searchByName(value).subscribe(produs => {
        this.produsToDisplay = produs;
      });
    })
  }

  // loadProduseList(){
  //   this.produseService.getProduseAutocomplete().subscribe(produse=>{
  //     this.produsToDisplay = produse;
  //     console.log(this.produsToDisplay);
  //   });    
  // }

  optionSelected(event: MatAutocompleteSelectedEvent){
    //console.log(event.option.value);
    //this.selectedProdus.push(event.option.value);
    //this.onOptionSelected.emit(event.option.value);
    //this.produsCtrl.patchValue('');

    console.log('option selected:', event.option.value);

    this.produsCtrl.patchValue('');

    if (this.selectedProdus.findIndex(x => x.id == event.option.value.id) !== -1){
      return;
    }

    this.selectedProdus.push(event.option.value);
    console.log('inainte de adaugat ransul', this.selectedProdus);
    if (this.table !== undefined){
      this.table.renderRows();
    }
  }

  selectFurnizor(furnizorId: any){
    //console.log('furnizorId', furnizorId);
     //this.furnizorFormGroup.get('furnizorId')?.setValue(furnizorId);
     this.selectedProdus[this.selectedProdus.length-1].furnizorId = furnizorId;

     console.log('this.selectedProdus[this.selectedProdus.length-1]', this.selectedProdus[this.selectedProdus.length-1]);

     const inpp: HTMLInputElement[] = Array.from(document.getElementsByClassName('clsF')) as HTMLInputElement[];
     inpp.forEach(f=>{
       console.log('f:', f);
       console.log('f.value:', f.value);
       if(f.value == "") f.value = furnizorId;
       console.log('f.value2:', f.value);
     })

     console.log('furnizor set: ', this.furnizorFormGroup.get('furnizorId'));
  }

  private _filterStates(value: string): produseOfertaDTO[] {
    const filterValue = value.toLowerCase();
    return this.produsToDisplay.filter(p => p.produsNume.toLowerCase().includes(filterValue));
  }

  remove(produs:produseDTO){
    const index = this.selectedProdus.findIndex(a => a.id === produs.id);
    this.selectedProdus.splice(index, 1);
    this.table.renderRows();
  }

  dropped(event: CdkDragDrop<any[]>){
    const previousIndex = this.selectedProdus.findIndex(produs => produs === event.item.data);
    moveItemInArray(this.selectedProdus, previousIndex, event.currentIndex);
    this.table.renderRows();
  }
}
