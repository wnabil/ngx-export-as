import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Rx';

import { ExportAsOptions } from './export-as-options.model';

declare const jQuery, $: any;

@Injectable()
export class ExportAsService {

  constructor() { }

  getFile(options: ExportAsOptions): Observable<string> {

    jQuery(`#${options.tableID}`).tableExport({type: 'pdf'});
    return Observable.create();
  }

}
