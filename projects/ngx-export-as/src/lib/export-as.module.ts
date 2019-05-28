/**
 * angular imports
 */
import { NgModule } from '@angular/core';

/**
 * my imports
 */
import { ExportAsService } from './export-as.service';

@NgModule({
  providers: [ExportAsService],
})
export class ExportAsModule { }


