import { Component, OnDestroy, OnInit } from '@angular/core';
import { UnsubscribeService } from 'src/app/unsubscribe.service';
import { RapoarteService } from '../rapoarte.service';
import * as Highcharts from 'highcharts';
import HC_more from 'highcharts/highcharts-more';
import HC_exporting from 'highcharts/modules/exporting';
import HC_exportData from 'highcharts/modules/export-data';
import { takeUntil } from 'rxjs/operators';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
HC_exporting(Highcharts);
HC_exportData(Highcharts);
HC_more(Highcharts);

@Component({
    selector: 'app-timeline-stock',
    templateUrl: './timeline-stock.component.html',
    styleUrls: ['./timeline-stock.component.scss'],
    standalone: false
})
export class TimelineStockComponent implements OnInit, OnDestroy{
  produsId: number = 0;
  constructor(private activatedRoute: ActivatedRoute, private reportService: RapoarteService, private unsubscribeService: UnsubscribeService) {}
  
  ngOnInit(): void {
    this.activatedRoute.params.subscribe(params => {
      if(params.id == null) return;
      this.produsId = params.id;
    });
    this.loadTimelineStockProduse();
  }

  //#region Timeline stock produse
  chartOptionsTimelineStock:Highcharts.Options = {
    chart: {
        type: 'waterfall'
    },

    title: {
        text: 'Stoc timeline'
    },

    xAxis: {
        type: 'category'
    },

    yAxis: {
        title: {
            text: 'Stoc'
        }
    },

    legend: {
        enabled: false
    },

    tooltip: {
        pointFormat: '<b>{point.y:,.2f}</b>'
    }    
  };

  loadTimelineStockProduse(){
    const fromDate = new Date();
    fromDate.setFullYear(fromDate.getFullYear() - 1);
    fromDate.setMonth(fromDate.getMonth() === 12 ? 1 : fromDate.getMonth() + 1);
    fromDate.setDate(1);
    const toDate = new Date();
    toDate.setDate(toDate.getDate() + 1);

    let filter = {
      fromDate: fromDate.toISOString().split('T')[0],
      toDate: toDate.toISOString().split('T')[0],
      produsId: this.produsId
    };
    
    var options = Highcharts.getOptions();
    this.reportService.timelineStockProduse(filter)
    .pipe(takeUntil(this.unsubscribeService.unsubscribeSignal$))
    .subscribe((response: HttpResponse<any>)=>{
      let chartSerie = response.body??[];
      this.chartOptionsTimelineStock.series = [{
        upColor: options.colors ? options.colors[2] : '#00e272',
        color: options.colors ? options.colors[3] : '#fe6a35',
        data: chartSerie.map((t: any) => ({ y: t.valoare, name: t.luna })),
        type: 'waterfall',
        dataLabels: {
          enabled: true,
          format: '{point.y:,.0f}', // Display the Y value as the label
        },
        pointPadding: 0
      }];
      this.updateChartTimelineStock();      
    });
  }

  updateChartTimelineStock(): void {    
    Highcharts.chart('timelineStock', this.chartOptionsTimelineStock);
  }

  ngOnDestroy(): void { }
}
