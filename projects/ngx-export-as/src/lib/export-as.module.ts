import { NgModule } from '@angular/core';
import { ExportAsService } from './export-as.service';

/**
 * NgxExportAs Module
 * 
 * @description
 * Angular module that provides export functionality for HTML/Table elements to various file formats.
 * Registers the ExportAsService as a provider for use throughout your application.
 * 
 * @export
 * @class ExportAsModule
 * 
 * @example
 * ```typescript
 * import { ExportAsModule } from 'ngx-export-as';
 * 
 * @NgModule({
 *   imports: [
 *     BrowserModule,
 *     ExportAsModule
 *   ]
 * })
 * export class AppModule { }
 * ```
 * 
 * @usageNotes
 * Import this module once in your root AppModule or a feature module.
 * The ExportAsService will be available for injection in any component or service.
 */
@NgModule({
  providers: [ExportAsService],
})
export class ExportAsModule { }


