import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { AfterViewInit, Component, EventEmitter, Input, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, FormsModule, Validators  } from '@angular/forms';
import { MatAutocompleteSelectedEvent, MatAutocompleteTrigger } from '@angular/material/autocomplete';
import { MatTable } from '@angular/material/table';
import { ActivatedRoute } from '@angular/router';
import {Observable, Subscription} from 'rxjs';
import {map, startWith} from 'rxjs/operators';
import { produseDTO, produseOfertaDTO } from '../produse-item/produse.model';
import { ProduseService } from '../produse.service';

@Component({
  selector: 'app-produse-autocomplete',
  templateUrl: './produse-autocomplete.component.html',
  styleUrls: ['./produse-autocomplete.component.scss']
})
export class ProduseAutocompleteComponent implements OnInit, AfterViewInit, OnDestroy {

  produse: produseDTO[]
  constructor(private activatedRoute: ActivatedRoute, private formBuilder:FormBuilder, private produseService: ProduseService) { 
    this.produse = [];   

    this.selectedProdus = new Observable<produseOfertaDTO[]>();
    this.selectedProdus = this.produsCtrl.valueChanges
      .pipe(
        startWith(''),
        map(state => state ? this._filterStates(state) : this.produse.slice())
      );    
  }

  @ViewChild(MatAutocompleteTrigger) 
  trigger!: MatAutocompleteTrigger;
  
  produsCtrl: FormControl = new FormControl();

  selectedProdus: any;
  @Input()
  preselectedProdus: produseOfertaDTO[] | undefined;

  @Output()
  onOptionSelected: EventEmitter<string> = new EventEmitter<string>();
  
  subscription: Subscription | undefined;
  
  ngOnInit(): void {    
    this.loadProduseList();    
  }

  loadProduseList(){    
    this.produseService.getAll().subscribe(produse=>{
      this.produse = produse;
      console.log(this.produse);
      this.produsCtrl.setValue(this.preselectedProdus);
    });    
  }

  optionSelected(event: MatAutocompleteSelectedEvent){    
    this.onOptionSelected.emit(event.option.value);
  }

  private _filterStates(value: string): produseDTO[] {
    const filterValue = value;
    return this.produse.filter(p => p.nume.includes(filterValue));
  }

  displayFn(produs: produseDTO): string {
    return produs && produs.nume ? produs.nume : '';
  }

  ngAfterViewInit() {
    this._subscribeToClosingActions();
  }

  ngOnDestroy() {
    if (this.subscription && !this.subscription.closed) {
      this.subscription.unsubscribe();
    }
  }

  private _subscribeToClosingActions(): void {
    if (this.subscription && !this.subscription.closed) {
      this.subscription.unsubscribe();
    }

    this.subscription = this.trigger.panelClosingActions
      .subscribe(e => {
        if (!e || !e.source) {
          this.produsCtrl.setValue(null);
          this.onOptionSelected.emit(undefined);
        }
      },
      err => this._subscribeToClosingActions(),
      () => this._subscribeToClosingActions());
  }
}
