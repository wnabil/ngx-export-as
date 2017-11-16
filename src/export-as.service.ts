import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Rx';

import { ExportAsConfig } from './export-as-config.model';

import * as jsPDF from 'jspdf';
import * as html2canvas from 'html2canvas';

@Injectable()
export class ExportAsService {

  constructor() { }

  get(config: ExportAsConfig): Observable<string | null> {
    const func = "get" + config.type.toUpperCase();
    return this[func](config);
  }

  save(config: ExportAsConfig, fileName: string): void {
    config.download = true;
    config.fileName = fileName;
    this.get(config).subscribe();
  }

  contentToBlob(content: string): Observable<Blob> {
    return Observable.create((observer) => {
      fetch(content)
      .then(res => res.blob())
      .then(blob => {
        observer.next(blob);
        observer.complete();
      });
    });
  }

  download(fileName, dataURL): void {
    this.contentToBlob(dataURL).subscribe(blob => {
      const element = document.createElement('a');
      const url = window.URL.createObjectURL(blob);
      element.setAttribute('download', fileName);
      element.style.display = 'none';
      document.body.appendChild(element);
      element.href = url;
      element.click();
      document.body.removeChild(element);
    });
  }

  private getPDF(config: ExportAsConfig): Observable<string | null> {
    return Observable.create((observer) => {
      const jspdf = new jsPDF();
      this.getPNG(config).subscribe(imgData => {
        jspdf.addImage(imgData, 'PNG', 0, 0);
        if (config.download) {
          jspdf.save(config.fileName);
          observer.next();
        }else {
          observer.next(jspdf.output("datauristring"));
        }
        observer.complete();
      }, err => {
        observer.error(err);
      });
    });
  }

  private getPNG(config: ExportAsConfig): Observable<string | null> {
    return Observable.create((observer) => {
      const element: HTMLElement = document.getElementById(config.elementId);
      html2canvas(element).then((canvas) => {
        const imgData = canvas.toDataURL("image/PNG");
        if (config.type == "png" && config.download) {
          this.download(config.fileName, imgData);
          observer.next();
        }else {
          observer.next(imgData);
        }
        observer.complete();
      }, err => {
        observer.error(err);
      });
    });
  }

}
