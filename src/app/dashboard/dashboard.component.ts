import { Component, OnDestroy, OnInit } from '@angular/core';
import * as Highcharts from 'highcharts';
import HC_exporting from 'highcharts/modules/exporting';
import HC_exportData from 'highcharts/modules/export-data';
import { RapoarteService } from '../rapoarte/rapoarte.service';
import { comenziPerLuna } from '../rapoarte/comenzi-depozite/comenzi-depozite.model';
import { HttpResponse } from '@angular/common/http';
import { UnsubscribeService } from '../unsubscribe.service';
import { takeUntil } from 'rxjs/operators';
HC_exporting(Highcharts);
HC_exportData(Highcharts);

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit, OnDestroy {  
  chartData: any[] = [];
  constructor(private reportService: RapoarteService, private unsubscribeService: UnsubscribeService) {}
  
  ngOnInit(): void {
    this.loadTrendComenzi();
    this.loadTrendComenziPerUtilizator();
    this.loadTrendComenziClientiNoi();
  }

  //#region Trend comenzi per utilizator
  chartOptionsTrendComenziPerUtilizator: Highcharts.Options ={    
    title: {
        text: 'Trend comenzi per utilizator'
    },
    // subtitle: {
    //     text: 'Source: ' +
    //         '<a href="https://en.wikipedia.org/wiki/List_of_cities_by_average_temperature" ' +
    //         'target="_blank">Wikipedia.com</a>'
    // },    
    yAxis: {
        title: {
            text: 'Numar comenzi'
        }
    },
    plotOptions: {
        line: {
            dataLabels: {
                enabled: true
            },
            enableMouseTracking: false
        }
    }    
  }  

  // Map your data to match the series format
  mapChartData(data: any[]): Highcharts.SeriesOptionsType[] {
    const seriesData: Highcharts.SeriesOptionsType[] = [];

    // Get distinct 'nume' values
    const distinctNames = Array.from(new Set(data.map(item => item.nume)));

    // Create a series for each distinct 'nume'
    distinctNames.forEach(name => {
      const series: Highcharts.SeriesOptionsType = {
        name: name,
        data: data
          .filter(item => item.nume === name)
          .map(item => item.cantitate),
        type: 'column',
      };
      seriesData.push(series);
    });

    return seriesData;
  }

  private loadTrendComenziPerUtilizator() {    
    const fromDate = new Date();
    fromDate.setFullYear(fromDate.getFullYear() - 1);
    fromDate.setMonth(fromDate.getMonth() === 12 ? 1 : fromDate.getMonth() + 1);
    fromDate.setDate(1);
    const toDate = new Date();
    toDate.setDate(toDate.getDate() + 1);        

    let filter = {
      fromDate: fromDate.toISOString().split('T')[0],
      toDate: toDate.toISOString().split('T')[0],
    };
    this.reportService.trendComenziPerUtilizator(filter)
    .pipe(takeUntil(this.unsubscribeService.unsubscribeSignal$))
    .subscribe((response: HttpResponse<comenziPerLuna[]>)=>{
      let chartSerie = response.body ?? [];
      console.log('chartSerie', chartSerie);
      
      this.chartOptionsTrendComenziPerUtilizator.series = this.mapChartData(chartSerie);
      this.chartOptionsTrendComenziPerUtilizator.xAxis = {  
        categories: Array.from(new Set(chartSerie.map(item => item.luna)))
      };
      // const groupedData: { [key: string]: { nume: string, valoare: number[] } } = chartSerie.reduce((result, item) => {
      //   if (!result[item.nume]) {
      //     result[item.nume] = { nume: item.nume, valoare: [] };
      //   }
      //   result[item.nume].valoare.push(item.valoare);
      //   return result;
      // }, {} as { [key: string]: { nume: string, valoare: number[] } });
      // console.log('groupedData', groupedData);

      // this.chartOptionsTrendComenzi.series = Object.keys(groupedData).map(nume => ({
      //   name: nume,
      //   data: groupedData[nume].valoare,
      //   type: 'line',
      // }));
      // this.chartOptionsTrendComenzi.xAxis = {
      //   categories: chartSerie.map(t => t.luna),
      // };
      // console.log('this.chartOptionsTrendComenzi.series', this.chartOptionsTrendComenzi);      
      this.updateChartTrendComenziPerUtilizator();      
    });
  }
  updateChartTrendComenziPerUtilizator(): void {
    console.log('this.chartOptionsTrendComenziPerUtilizator ss', this.chartOptionsTrendComenziPerUtilizator);
    Highcharts.chart('trendComenziPerUtilizator', this.chartOptionsTrendComenziPerUtilizator);
  }
  //#endregion

  //#region Trend comenzi 
  chartOptionsTrendComenzi: Highcharts.Options = {
    chart: {
      type: 'column'
    },
    title: {
      text: 'Trend comenzi'
    },
    tooltip: {
      pointFormat: 'Numar comenzi: <b>{point.y}</b>'
    },    
    xAxis: {
      type: 'category',      
    },
    yAxis: {
      title: {
        text: 'Numar comenzi'
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

  private loadTrendComenzi() {
    const fromDate = new Date();
    fromDate.setFullYear(fromDate.getFullYear() - 1);
    fromDate.setMonth(fromDate.getMonth() === 12 ? 1 : fromDate.getMonth() + 1);
    fromDate.setDate(1);
    const toDate = new Date();
    toDate.setDate(toDate.getDate() + 1);

    let filter = {
      fromDate: fromDate.toISOString().split('T')[0],
      toDate: toDate.toISOString().split('T')[0],
    };
    this.reportService.trendComenzi(filter)
    .pipe(takeUntil(this.unsubscribeService.unsubscribeSignal$))
    .subscribe((response: HttpResponse<comenziPerLuna[]>)=>{
      let chartSerie = response.body??[];
      console.log('trendComenzi', chartSerie);
      this.chartOptionsTrendComenzi.series = [{
        data: chartSerie.map(t => ({ y: t.cantitate, name: t.luna })),        
        type: 'column',
        dataLabels: {
          enabled: true,
          format: '{point.y:,.0f}', // Display the Y value as the label
        },
      }];
      this.updateChartTrendComenzi();      
    });
  }  

  updateChartTrendComenzi(): void {
    this.chartOptionsTrendComenzi.subtitle = { 
      
     };
    Highcharts.chart('trendComenzi', this.chartOptionsTrendComenzi);
  }
  //#endregion

  //#region Trend comenzi clienti noi
  chartOptionsTrendComenziClientiNoi: Highcharts.Options = {
    chart: {
      type: 'column'
    },
    title: {
      text: 'Trend comenzi clienti noi'
    },
    tooltip: {
      pointFormat: 'Numar comenzi: <b>{point.y}</b>'
    },    
    xAxis: {
      type: 'category',      
    },
    yAxis: {
      title: {
        text: 'Numar comenzi'
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

  private loadTrendComenziClientiNoi() {
    const fromDate = new Date();
    fromDate.setFullYear(fromDate.getFullYear() - 1);
    fromDate.setMonth(fromDate.getMonth() === 12 ? 1 : fromDate.getMonth() + 1);
    fromDate.setDate(1);
    const toDate = new Date();
    toDate.setDate(toDate.getDate() + 1);

    let filter = {
      fromDate: fromDate.toISOString().split('T')[0],
      toDate: toDate.toISOString().split('T')[0],
    };
    this.reportService.trendComenziClientNou(filter)
    .pipe(takeUntil(this.unsubscribeService.unsubscribeSignal$))
    .subscribe((response: HttpResponse<comenziPerLuna[]>)=>{
      let chartSerie = response.body??[];
      console.log('trendComenziClientNou', chartSerie);
      this.chartOptionsTrendComenziClientiNoi.series = [{
        data: chartSerie.map(t => ({ y: t.valoare, name: t.luna })),        
        type: 'column',
        dataLabels: {
          enabled: true,
          format: '{point.y:,.0f}', // Display the Y value as the label
        },
      }];
      this.updateChartTrendComenziClientiNoi();      
    });
  }  

  updateChartTrendComenziClientiNoi(): void {
    this.chartOptionsTrendComenziClientiNoi.subtitle = { 
      
     };
    Highcharts.chart('trendComenziClientNou', this.chartOptionsTrendComenziClientiNoi);
  }
  //#endregion

  ngOnDestroy(): void { }
}
