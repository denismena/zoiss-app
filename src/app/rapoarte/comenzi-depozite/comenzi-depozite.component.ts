import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { RapoarteService } from '../rapoarte.service';
import { depoziteComenziDTO } from './comenzi-depozite.model';
import { formatDateFormData } from 'src/app/utilities/utils';
import { HttpResponse } from '@angular/common/http';

@Component({
  selector: 'app-comenzi-depozite',
  templateUrl: './comenzi-depozite.component.html',
  styleUrls: ['./comenzi-depozite.component.scss']
})
export class ComenziDepoziteComponent implements OnInit {
  loading$: boolean = true;
  comenziDepozite: depoziteComenziDTO[] = [];
  public form!: FormGroup;

  columnsToDisplay= ['depozit', 'cantitate', 'valoare'];
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
    this.reportService.comenziDepozite(values).subscribe((response: HttpResponse<depoziteComenziDTO[]>)=>{
      this.comenziDepozite = response.body??[];
      this.loading$ = false;
    });    
  }

  getTotalCost() {
    return this.comenziDepozite.map(t => t.valoare).reduce((acc, value) => Number(acc) + Number(value), 0);
  }
  getTotalNumber() {
    return this.comenziDepozite.map(t => t.cantitate).reduce((acc, value) => Number(acc) + Number(value), 0);
  } 
}
