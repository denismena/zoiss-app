import { enableProdMode, provideZoneChangeDetection } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { provideHighcharts } from 'highcharts-angular';

import { AppModule } from './app/app.module';
import { environment } from './environments/environment';

if (environment.production) {
  enableProdMode();
}

platformBrowserDynamic().bootstrapModule(AppModule, {
  applicationProviders: [
    provideZoneChangeDetection(),
    provideHighcharts({
      modules: () => [
        import('highcharts/esm/modules/exporting'),
        import('highcharts/esm/modules/export-data'),
        import('highcharts/esm/highcharts-more'),
      ],
    }),
  ],
})
  .catch(err => console.error(err));
