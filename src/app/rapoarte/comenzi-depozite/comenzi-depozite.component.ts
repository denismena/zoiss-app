import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { RapoarteService } from '../rapoarte.service';
import { sucursaleComenziDTO } from './comenzi-depozite.model';
import { formatDateFormData } from 'src/app/utilities/utils';
import { HttpResponse } from '@angular/common/http';
import * as Highcharts from 'highcharts';
import HC_exporting from 'highcharts/modules/exporting';
import HC_exportData from 'highcharts/modules/export-data';
import { UnsubscribeService } from 'src/app/unsubscribe.service';
import { takeUntil } from 'rxjs/operators';
HC_exporting(Highcharts);
HC_exportData(Highcharts);

@Component({
    selector: 'app-comenzi-depozite',
    templateUrl: './comenzi-depozite.component.html',
    styleUrls: ['./comenzi-depozite.component.scss'],
    standalone: false
})
export class ComenziDepoziteComponent implements OnInit, OnDestroy {
  loading$: boolean = true;
  comenziDepozite: sucursaleComenziDTO[] = [];
  public form!: FormGroup;

  columnsToDisplay= ['sucursala', 'cantitate', 'valoare'];
  chartOptions: Highcharts.Options = {
    chart: {
      type: 'pie'
    },
    title: {
      text: 'Comenzi per sucursale'
    },
    tooltip: {
      pointFormat: 'Valoarea comenzilor: <b>{point.y} millions</b>'
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
  constructor(private reportService: RapoarteService, private formBuilder:FormBuilder, private unsubscribeService: UnsubscribeService) {}

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
      // values.arhitectId = values.arhitectId;
      // values.status = values.status;
      values.fromDate = formatDateFormData(values.fromDate);
      values.toDate = formatDateFormData(values.toDate);
      this.loadList(values);            
    })
  }
  
  loadList(values: any){
    this.reportService.comenziSucursale(values)
    .pipe(takeUntil(this.unsubscribeService.unsubscribeSignal$))
    .subscribe((response: HttpResponse<sucursaleComenziDTO[]>)=>{
      this.comenziDepozite = response.body??[];
      this.chartOptions.series = [{
        data: this.comenziDepozite.map(t => ({ y: t.valoare, name: t.sucursala })),        
        type: 'pie',
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
    return this.comenziDepozite.map(t => t.valoare).reduce((acc, value) => Number(acc) + Number(value), 0).toFixed(2);
  }
  getTotalNumber() {
    return this.comenziDepozite.map(t => t.cantitate).reduce((acc, value) => Number(acc) + Number(value), 0).toFixed(2);
  }
  
  ngOnDestroy(): void {}
}
