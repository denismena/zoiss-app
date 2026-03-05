import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { formatDateFormData } from 'src/app/utilities/utils';
import { RapoarteService } from '../rapoarte.service';
import { utilizatoriComenziDTO } from './comenzi-utilizatori.model';
import { HttpResponse } from '@angular/common/http';
import { UnsubscribeService } from 'src/app/unsubscribe.service';
import { takeUntil } from 'rxjs/operators';
import { HighchartsChartDirective } from 'highcharts-angular';
import { MaterialModule } from 'src/app/material/material.module';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-comenzi-utilizatori',
    templateUrl: './comenzi-utilizatori.component.html',
    styleUrls: ['./comenzi-utilizatori.component.scss'],
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule, MaterialModule, HighchartsChartDirective],
})
export class ComenziUtilizatoriComponent implements OnInit, OnDestroy {
  loading$: boolean = true;
  comenziUtilizatori: utilizatoriComenziDTO[] = [];
  public form!: FormGroup;

  columnsToDisplay = ['utilizator', 'cantitate', 'valoare'];
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
  };

  constructor(private reportService: RapoarteService, private formBuilder: FormBuilder, private unsubscribeService: UnsubscribeService) {}

  ngOnInit(): void {
    const date: Date = new Date();
    date.setDate(date.getDate() - 30);
    this.form = this.formBuilder.group({
      arhitectId: 0,
      fromDate: formatDateFormData(date),
      toDate: formatDateFormData(new Date()),
      status: ''
    });

    this.loadList(this.form.value);

    this.form.valueChanges.subscribe(values => {
      values.arhitectId = values.arhitectId;
      values.status = values.status;
      values.fromDate = formatDateFormData(values.fromDate);
      values.toDate = formatDateFormData(values.toDate);
      this.loadList(values);
    });
  }

  loadList(values: any) {
    this.reportService.comenziUtilizatori(values)
    .pipe(takeUntil(this.unsubscribeService.unsubscribeSignal$))
    .subscribe((response: HttpResponse<utilizatoriComenziDTO[]>) => {
      this.comenziUtilizatori = response.body ?? [];
      this.chartOptions = {
        ...this.chartOptions,
        subtitle: {
          text: 'Total: ' + this.getTotalCost() + ' lei'
        },
        series: [{
          data: this.comenziUtilizatori.map(t => ({ y: t.valoare, name: t.utilizator })),
          type: 'column',
          dataLabels: {
            enabled: true,
            format: '{point.y:,.2f}',
          },
        }],
      };
      this.loading$ = false;
    });
  }

  getTotalCost() {
    return this.comenziUtilizatori.map(t => t.valoare).reduce((acc, value) => Number(acc) + Number(value), 0).toFixed(2);
  }
  getTotalNumber() {
    return this.comenziUtilizatori.map(t => t.cantitate).reduce((acc, value) => Number(acc) + Number(value), 0).toFixed(2);
  }

  ngOnDestroy(): void {}
}
