import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { formatDateFormData } from 'src/app/utilities/utils';
import { RapoarteService } from '../rapoarte.service';
import { utilizatoriComenziDTO } from './comenzi-utilizatori.model';
import { HttpResponse } from '@angular/common/http';

@Component({
  selector: 'app-comenzi-utilizatori',
  templateUrl: './comenzi-utilizatori.component.html',
  styleUrls: ['./comenzi-utilizatori.component.scss']
})
export class ComenziUtilizatoriComponent implements OnInit{
  loading$: boolean = true;
  comenziUtilizatori: utilizatoriComenziDTO[] = [];
  public form!: FormGroup;

  columnsToDisplay= ['utilizator', 'valoare'];
  constructor(private reportService: RapoarteService, private formBuilder:FormBuilder) {}
  
  ngOnInit(): void {
    let date: Date = new Date();
    date.setDate(date.getDate() - 30);
    this.form = this.formBuilder.group({
      arhitectId: 0,
      fromDate: formatDateFormData(date),
      toDate: formatDateFormData(new Date()),
      status: ''
    });

    this.loadList(this.form.value);

    this.form.valueChanges.subscribe(values=>{
      values.arhitectId = values.arhitectId;
      values.status = values.status;
      values.fromDate = formatDateFormData(values.fromDate);
      values.toDate = formatDateFormData(values.toDate);
      this.loadList(values);            
    })
  }

  loadList(values: any){
    this.reportService.comenziUtilizatori(values).subscribe((response: HttpResponse<utilizatoriComenziDTO[]>)=>{
      this.comenziUtilizatori = response.body??[];
      this.loading$ = false;
    });    
  }

  getTotalCost() {
    return this.comenziUtilizatori.map(t => t.valoare).reduce((acc, value) => Number(acc) + Number(value), 0);
  }  
}
