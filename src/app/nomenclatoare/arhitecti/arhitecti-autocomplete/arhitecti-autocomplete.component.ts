import { AfterViewInit, Component, EventEmitter, Input, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatAutocompleteSelectedEvent, MatAutocompleteTrigger } from '@angular/material/autocomplete';
import { MatDialog } from '@angular/material/dialog';
import { Observable, Subscription } from 'rxjs';
import { map, startWith, takeUntil } from 'rxjs/operators';
import { ArhitectiCreateDialogComponent } from '../arhitecti-item/arhitecti-create-dialog/arhitecti-create-dialog.component';
import { arhitectiDTO } from '../arhitecti-item/arhitecti.model';
import { ArhitectiService } from '../arhitecti.service';
import { UnsubscribeService } from 'src/app/unsubscribe.service';

@Component({
  selector: 'app-arhitecti-autocomplete',
  templateUrl: './arhitecti-autocomplete.component.html',
  styleUrls: ['./arhitecti-autocomplete.component.scss']
})
export class ArhitectiAutocompleteComponent implements OnInit, AfterViewInit, OnDestroy {

  arhitecti: arhitectiDTO[];
  constructor(private arhitectiService: ArhitectiService, public dialog: MatDialog, private unsubscribeService: UnsubscribeService) { 
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
  dataFromDialog : any;
  ngOnInit(): void {
    this.loadArhitectList();
  }

  loadArhitectList(){
    this.arhitectiService.getAll()
    .pipe(takeUntil(this.unsubscribeService.unsubscribeSignal$))
    .subscribe(arhitecti=>{
      this.arhitecti = arhitecti;
      this.arhitectCtrl.setValue(this.preselectArhitect);
    });    
  }

  optionSelected(event: MatAutocompleteSelectedEvent){    
    this.preselectArhitect = event.option.value;
    this.onOptionSelected.emit(event.option.value);
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
          if(this.preselectArhitect == undefined)//daca nu are nimic selectat, scrisul este sters
            this.arhitectCtrl.setValue(null);
          if(this.arhitectCtrl.value == '') //daca scrisul este gol atunci trimit ca nimic selectat
            this.onOptionSelected.emit(undefined);
        }
      },
      err => this._subscribeToClosingActions(),
      () => this._subscribeToClosingActions());
  }

  public clearSelection(){
    this.arhitectCtrl.setValue(null);
  }

  addArhitectDialog(){
    const dialogRef = this.dialog.open(ArhitectiCreateDialogComponent,      
      { data:{editId:0}, width: '800px', height: '600px' });

      dialogRef.afterClosed()
      .pipe(takeUntil(this.unsubscribeService.unsubscribeSignal$))
      .subscribe((data) => {      
        if (data.clicked === 'submit') {
          this.dataFromDialog = data.form;
          this.dataFromDialog.id = data.id;
          this.arhitectCtrl.setValue(this.dataFromDialog);
          this.onOptionSelected.emit(this.dataFromDialog);
        }
      });
  }
  editArhitectDialog(){
    const dialogRef = this.dialog.open(ArhitectiCreateDialogComponent,      
      { data:{arhitect: this.preselectArhitect, editId: this.preselectArhitect?.id??0}, width: '800px', height: '600px' });

      dialogRef.afterClosed()
      .pipe(takeUntil(this.unsubscribeService.unsubscribeSignal$))
      .subscribe((data) => {      
        if (data.clicked === 'submit') {
          this.dataFromDialog = data.form;
          this.dataFromDialog.id = data.id;
          this.arhitectCtrl.setValue(this.dataFromDialog);
          this.onOptionSelected.emit(this.dataFromDialog);
        }
      });

  }

}
