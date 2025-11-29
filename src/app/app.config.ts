import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { ExportAsService } from 'ngx-export-as';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
  ]
};
