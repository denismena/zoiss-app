import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { formatDateFormData } from 'src/app/utilities/utils';
import { RapoarteService } from '../rapoarte.service';
import { utilizatoriComenziDTO } from './comenzi-utilizatori.model';
import { HttpResponse } from '@angular/common/http';
import * as Highcharts from 'highcharts';
import HC_exporting from 'highcharts/modules/exporting';
import HC_exportData from 'highcharts/modules/export-data';
HC_exporting(Highcharts);
HC_exportData(Highcharts);
@Component({
  selector: 'app-comenzi-utilizatori',
  templateUrl: './comenzi-utilizatori.component.html',
  styleUrls: ['./comenzi-utilizatori.component.scss']
})
export class ComenziUtilizatoriComponent implements OnInit{
  loading$: boolean = true;
  comenziUtilizatori: utilizatoriComenziDTO[] = [];
  public form!: FormGroup;

  columnsToDisplay= ['utilizator', 'cantitate', 'valoare'];
  chartOptions: Highcharts.Options = {
    chart: {
      type: 'column'
    },
    title: {
      text: 'Comenzi per utilizatori'
    },
    tooltip: {
      pointFormat: 'Valoarea comenzilor: <b>{point.y}</b>'
    },    
    xAxis: {
      type: 'category',      
    },
    yAxis: {
      title: {
        text: 'Valoare'
      }
    },
    exporting: {
      enabled: true,
      buttons: {
        contextButton: {
          menuItems: ['downloadPNG', 'downloadJPEG', 'downloadPDF', 'downloadSVG'],
        },
      },
    },
    legend: {
      enabled: false
    },
    /* Your initial chart options here */
  };
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
      this.chartOptions.series = [{
        data: this.comenziUtilizatori.map(t => ({ y: t.valoare, name: t.utilizator })),        
        type: 'column',
        dataLabels: {
          enabled: true,
          format: '{point.y:,.2f}', // Display the Y value as the label
        },
      }];
      this.updateChart();
      this.loading$ = false;
    });    
  }

  updateChart(): void {
    this.chartOptions.subtitle = { 
      text: 'Total: ' + this.getTotalCost() + ' lei'
     };
    Highcharts.chart('your-chart-container', this.chartOptions);
  }

  getTotalCost() {
    return this.comenziUtilizatori.map(t => t.valoare).reduce((acc, value) => Number(acc) + Number(value), 0).toFixed(2);
  }  
  getTotalNumber() {
    return this.comenziUtilizatori.map(t => t.cantitate).reduce((acc, value) => Number(acc) + Number(value), 0).toFixed(2);
  }
}