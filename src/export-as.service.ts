import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Rx';

import { ExportAsConfig } from './export-as-config.model';

import * as jsPDF from 'jspdf';
import * as html2canvas from 'html2canvas';

@Injectable()
export class ExportAsService {

  constructor() { }

  get(config: ExportAsConfig): Observable<Blob | null> {
    const func = "get" + config.type.toUpperCase();
    return this[func](config);
  }

  save(config: ExportAsConfig, fileName: string): void {
    config.download = true;
    config.fileName = fileName;
    this.get(config).subscribe();
  }

  private getPDF(config: ExportAsConfig): Observable<Blob | null> {
    return Observable.create((observer) => {
      const element: HTMLElement = document.getElementById(config.elementId);
      html2canvas(element).then((canvas) => {
        const imgData = canvas.toDataURL("image/PNG");
        const jspdf = new jsPDF();
        jspdf.addImage(imgData, 'PNG', 0, 0);
        if (config.download) {
          jspdf.save(config.fileName);
          observer.next();
        }else {
          observer.next(jspdf.output("blob"));
        }
        observer.complete();
      }, err => {
        observer.error(err);
      });
    });
  }

  // private download(filename, blob) {
  //   const element = document.createElement('a');
  //   const url = window.URL.createObjectURL(blob);
  //   element.setAttribute('download', filename);
  //   element.style.display = 'none';
  //   document.body.appendChild(element);
  //   element.href = url;
  //   element.click();
  //   document.body.removeChild(element);
  // }

}
