import { Component, DestroyRef, inject, OnInit } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { HttpResponse } from '@angular/common/http';
import { RapoarteService } from '../rapoarte.service';
import * as Highcharts from 'highcharts';
import { ActivatedRoute } from '@angular/router';
import { HighchartsChartDirective } from 'highcharts-angular';
import { MaterialModule } from 'src/app/material/material.module';
import { RouterModule } from '@angular/router';

@Component({
    selector: 'app-timeline-stock',
    templateUrl: './timeline-stock.component.html',
    styleUrls: ['./timeline-stock.component.scss'],
    standalone: true,
    imports: [RouterModule, MaterialModule, HighchartsChartDirective],
})
export class TimelineStockComponent implements OnInit {
  produsId: number = 0;
  private destroyRef = inject(DestroyRef);
  constructor(private activatedRoute: ActivatedRoute, private reportService: RapoarteService) {}

  ngOnInit(): void {
    this.activatedRoute.params.subscribe(params => {
      if (params['id'] == null) return;
      this.produsId = params['id'];
    });
    this.loadTimelineStockProduse();
  }

  chartOptionsTimelineStock: Highcharts.Options = {
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

  loadTimelineStockProduse() {
    const fromDate = new Date();
    fromDate.setFullYear(fromDate.getFullYear() - 1);
    fromDate.setMonth(fromDate.getMonth() === 12 ? 1 : fromDate.getMonth() + 1);
    fromDate.setDate(1);
    const toDate = new Date();
    toDate.setDate(toDate.getDate() + 1);

    const filter = {
      fromDate: fromDate.toISOString().split('T')[0],
      toDate: toDate.toISOString().split('T')[0],
      produsId: this.produsId
    };

    const options = Highcharts.getOptions();
    this.reportService.timelineStockProduse(filter)
    .pipe(takeUntilDestroyed(this.destroyRef))
    .subscribe((response: HttpResponse<any>) => {
      const chartSerie = response.body ?? [];
      this.chartOptionsTimelineStock = {
        ...this.chartOptionsTimelineStock,
        series: [{
          upColor: options.colors ? options.colors[2] : '#00e272',
          color: options.colors ? options.colors[3] : '#fe6a35',
          data: chartSerie.map((t: any) => ({ y: t.valoare, name: t.luna })),
          type: 'waterfall',
          dataLabels: {
            enabled: true,
            format: '{point.y:,.0f}',
          },
          pointPadding: 0
        }],
      };
    });
  }

}
