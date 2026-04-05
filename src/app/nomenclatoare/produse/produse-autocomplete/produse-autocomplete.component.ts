import { AfterViewInit, Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, FormsModule, Validators  } from '@angular/forms';
import { MatAutocompleteSelectedEvent, MatAutocompleteTrigger } from '@angular/material/autocomplete';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { DestroyRef, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import {Observable, Subscription, of} from 'rxjs';
import {debounceTime, startWith, switchMap} from 'rxjs/operators';
import { ProduseCreateDialogComponent } from '../produse-item/produse-create-dialog/produse-create-dialog.component';
import { produseDTO, produseOfertaDTO } from '../produse-item/produse.model';
import { ProduseService } from '../produse.service';

@Component({
    selector: 'app-produse-autocomplete',
    templateUrl: './produse-autocomplete.component.html',
    styleUrls: ['./produse-autocomplete.component.scss'],
    standalone: false
})
export class ProduseAutocompleteComponent implements OnInit, AfterViewInit, OnDestroy, OnChanges {

  private destroyRef = inject(DestroyRef);
  constructor(private produseService: ProduseService, public dialog: MatDialog) {
    this.selectedProdus = new Observable<produseDTO[]>();
  }

  @ViewChild(MatAutocompleteTrigger) 
  trigger!: MatAutocompleteTrigger;
  
  produsCtrl: FormControl = new FormControl();

  selectedProdus: Observable<produseDTO[]>;
  @Input()
  preselectedProdus: produseDTO | undefined;

  @Output()
  onOptionSelected: EventEmitter<string> = new EventEmitter<string>();
  
  subscription: Subscription | undefined;
  dataFromDialog : any;  

  ngOnInit(): void {
    if (this.preselectedProdus != undefined)
      this.produsCtrl.setValue(this.preselectedProdus);

    this.selectedProdus = this.produsCtrl.valueChanges.pipe(
      startWith(''),
      debounceTime(200),
      switchMap(value => {
        if (typeof value !== 'string' || value.length < 2) return of([]);
        return this.produseService.search(value);
      })
    );
  }
  ngOnChanges() {
    if (this.preselectedProdus != undefined)
      this.produsCtrl.setValue(this.preselectedProdus);
  }

  optionSelected(event: MatAutocompleteSelectedEvent){    
    this.preselectedProdus = event.option.value;
    this.onOptionSelected.emit(event.option.value);
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
        setTimeout(() => {
          if (!e || !e.source) {
            if(this.preselectedProdus == undefined)//daca nu are nimic selectat, scrisul este sters
              this.produsCtrl.setValue(null);
            if(this.produsCtrl.value == '') //daca scrisul este gol atunci trimit ca nimic selectat
              this.onOptionSelected.emit(undefined);
          }
        }, 0);
      },
      err => this._subscribeToClosingActions(),
      () => this._subscribeToClosingActions());
  }

  public clearSelection(){
    this.produsCtrl.setValue(null);
  }

  addProdusDialog(){
    const dialogRef = this.dialog.open(ProduseCreateDialogComponent,      
      { data:{editId:0}, width: '800px', height: '750px' });
      
      dialogRef.afterClosed()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((data) => {      
        if (data.clicked === 'submit') {
          this.dataFromDialog = data.form;
          this.dataFromDialog.id = data.id;
          this.produsCtrl.setValue(this.dataFromDialog);
          this.preselectedProdus = this.dataFromDialog;
          this.onOptionSelected.emit(this.dataFromDialog);
        }
      });      
  }
  editProdusDialog(){ 
    if(this.preselectedProdus == undefined)  return; 
    const dialogRef = this.dialog.open(ProduseCreateDialogComponent,      
      { data:{produs: this.preselectedProdus, editId: this.preselectedProdus?.id??0}, width: '800px', height: '750px' });
      
      dialogRef.afterClosed()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((data) => {      
        if (data.clicked === 'submit') {
          this.dataFromDialog = data.form;
          this.dataFromDialog.id = data.id;
          this.produsCtrl.setValue(this.dataFromDialog);
          this.preselectedProdus = this.dataFromDialog;
          this.onOptionSelected.emit(this.dataFromDialog);
        }
      });      
  }
}
