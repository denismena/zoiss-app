import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { arhitectiDTO } from '../arhitecti-item/arhitecti.model';
import { ArhitectiService } from '../arhitecti.service';

@Component({
  selector: 'app-arhitecti-autocomplete',
  templateUrl: './arhitecti-autocomplete.component.html',
  styleUrls: ['./arhitecti-autocomplete.component.scss']
})
export class ArhitectiAutocompleteComponent implements OnInit {

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
  arhitectCtrl: FormControl = new FormControl();
  selectedArhitect: any;

  @Input()
  preselectArhitect: arhitectiDTO | undefined;

  @Output()
  onOptionSelected: EventEmitter<string> = new EventEmitter<string>();
  
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
    const filterValue = value;
    return this.arhitecti.filter(p => p.nume.includes(filterValue));
  }

  displayFn(arhitect: arhitectiDTO): string {
    return arhitect && arhitect.nume ? arhitect.nume : '';
  }

}
