import { AfterViewInit, Component, EventEmitter, Input, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatAutocompleteSelectedEvent, MatAutocompleteTrigger } from '@angular/material/autocomplete';
import { Observable, Subscription } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { arhitectiDTO } from '../arhitecti-item/arhitecti.model';
import { ArhitectiService } from '../arhitecti.service';

@Component({
  selector: 'app-arhitecti-autocomplete',
  templateUrl: './arhitecti-autocomplete.component.html',
  styleUrls: ['./arhitecti-autocomplete.component.scss']
})
export class ArhitectiAutocompleteComponent implements OnInit, AfterViewInit, OnDestroy {

  arhitecti: arhitectiDTO[];
  constructor(private arhitectiService: ArhitectiService) { 
    this.arhitecti = [];
    
    this.selectedArhitect = new Observable<arhitectiDTO[]>();
    this.selectedArhitect = this.arhitectCtrl.valueChanges
      .pipe(
        startWith(''),
        map(c => c ? this._filterStates(c) : this.arhitecti.slice())
      );
  }

  @ViewChild(MatAutocompleteTrigger) 
  trigger!: MatAutocompleteTrigger;

  arhitectCtrl: FormControl = new FormControl();
  selectedArhitect: any;

  @Input()
  preselectArhitect: arhitectiDTO | undefined;

  @Output()
  onOptionSelected: EventEmitter<string> = new EventEmitter<string>();
  
  subscription: Subscription | undefined;
  
  ngOnInit(): void {
    this.loadArhitectList();
  }

  loadArhitectList(){
    this.arhitectiService.getAll().subscribe(arhitecti=>{
      this.arhitecti = arhitecti;
      console.log(this.arhitecti);
      this.arhitectCtrl.setValue(this.preselectArhitect);
    });    
  }

  optionSelected(event: MatAutocompleteSelectedEvent){
     console.log(event.option.value.id);
    this.onOptionSelected.emit(event.option.value.id);
  }
  
  private _filterStates(value: string): arhitectiDTO[] {
    const filterValue = (typeof value === 'string' ? value.toLowerCase() : value);
    return this.arhitecti.filter(p => p.nume.toLowerCase().includes(filterValue));
  }

  displayFn(arhitect: arhitectiDTO): string {
    return arhitect && arhitect.nume ? arhitect.nume : '';
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
          this.arhitectCtrl.setValue(null);
          this.onOptionSelected.emit(undefined);
        }
      },
      err => this._subscribeToClosingActions(),
      () => this._subscribeToClosingActions());
  }

}
