/**
 * angular imports
 */
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

/**
 * my imports
 */

import { ExportAsService } from './export-as.service';

@NgModule({
  imports: [
    CommonModule,
  ],
  declarations: [],
  providers: [ExportAsService],
})
export class ExportAsModule {}

/**
 * exports
 */
export { ExportAsService } from './export-as.service';
export { ExportAsConfig } from './export-as-config.model';


