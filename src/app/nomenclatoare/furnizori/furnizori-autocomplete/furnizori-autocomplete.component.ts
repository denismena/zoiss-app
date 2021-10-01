import { AfterViewInit, Component, EventEmitter, Input, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatAutocompleteSelectedEvent, MatAutocompleteTrigger } from '@angular/material/autocomplete';
import {Observable, Subscription} from 'rxjs';
import {map, startWith} from 'rxjs/operators';
import { furnizoriDTO } from '../furnizori-item/furnizori.model';
import { FurnizoriService } from '../furnizori.service';

@Component({
  selector: 'app-furnizori-autocomplete',
  templateUrl: './furnizori-autocomplete.component.html',
  styleUrls: ['./furnizori-autocomplete.component.scss']
})
export class FurnizoriAutocompleteComponent implements OnInit, AfterViewInit, OnDestroy {

  furnizori: furnizoriDTO[];
  constructor(private furnizorService: FurnizoriService ) { 
    this.furnizori = [];

    this.selectedFurnizor = new Observable<furnizoriDTO[]>();
    this.selectedFurnizor = this.furnizorCtrl.valueChanges
      .pipe(
        startWith(''),
        map(c => c ? this._filterStates(c) : this.furnizori.slice())
      );
  }
  @ViewChild(MatAutocompleteTrigger) 
  trigger!: MatAutocompleteTrigger;

  furnizorCtrl: FormControl = new FormControl();
  selectedFurnizor: any;
  
  @Input()
  preselectFurnizor: number = 0;


  @Output()
  onOptionSelected: EventEmitter<string> = new EventEmitter<string>();

  subscription: Subscription | undefined;
  
  ngOnInit(): void {
  this.loadFurnizorList();
  }

  loadFurnizorList(){
    this.furnizorService.getAll().subscribe(furnizori=>{
      this.furnizori = furnizori;
      console.log('preselectFurnizor', this.preselectFurnizor);
      
      if(this.preselectFurnizor !=0){
        this.furnizorService.getById(this.preselectFurnizor).subscribe(fur=>{
          this.furnizorCtrl.setValue(fur);
        })
      }     
      
    });    
  }

  optionSelected(event: MatAutocompleteSelectedEvent){    
    this.onOptionSelected.emit(event.option.value);
  }

  private _filterStates(value: string): furnizoriDTO[] {
    const filterValue = value;
    return this.furnizori.filter(p => p.nume.includes(filterValue));
  }

  displayFn(furn: furnizoriDTO): string {
    console.log('am trigeruit ceva la load furnizor?', furn);
    return furn && furn.nume ? furn.nume : '';
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
          this.furnizorCtrl.setValue(null);
          this.onOptionSelected.emit(undefined);
        }
      },
      err => this._subscribeToClosingActions(),
      () => this._subscribeToClosingActions());
  }
}
