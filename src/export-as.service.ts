import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Rx';

import { ExportAsConfig } from './export-as-config.model';

import * as html2canvas from 'html2canvas';
import * as jsPDF from 'jspdf';

global['html2canvas'] = html2canvas;
global['jsPDF'] = jsPDF;

@Injectable()
export class ExportAsService {

  constructor() { }

  get(config: ExportAsConfig): Observable<string | null> {
    const func = "get" + config.type.toUpperCase();

    if (this[func]) {
      return this[func](config);
    }

    return Observable.create((observer) => { observer.error("Export type is not supported.") });
  }

  save(config: ExportAsConfig, fileName: string): void {
    config.download = true;
    config.fileName = fileName + '.' + config.type;
    this.get(config).subscribe();
  }

  contentToBlob(content: string): Observable<Blob> {
    return Observable.create((observer) => {
      const arr = content.split(','), mime = arr[0].match(/:(.*?);/)[1],
      bstr = atob(arr[1])
      var n = bstr.length;
      const u8arr = new Uint8Array(n);
      while (n--) {
          u8arr[n] = bstr.charCodeAt(n);
      }
      observer.next(new Blob([u8arr], {type: mime}));
      observer.complete();
    });
  }

  removeFileTypeFromBase64(fileContent: string): string {
    const re = /^data:[^]*;base64,/g;
    const newContent: string = re[Symbol.replace](fileContent, '');
    return newContent;
  }

  addFileTypeToBase64(fileContent: string, fileMime: string): string {
    return `data:${fileMime};base64,${fileContent}`;
  }

  download(fileName: string, dataURL: string): void {
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
      const element: HTMLElement = document.getElementById(config.elementId);
      jspdf.addHTML(element, function() {
        if (config.download) {
          jspdf.save(config.fileName);
          observer.next();
        }else {
          observer.next(jspdf.output("datauristring"));
        }
        observer.complete();
      });
    });
  }

  private getPNG(config: ExportAsConfig): Observable<string | null> {
    return Observable.create((observer) => {
      const element: HTMLElement = document.getElementById(config.elementId);
      html2canvas(element, config.options).then((canvas) => {
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

  private getCSV(config: ExportAsConfig): Observable<string | null> {
    return Observable.create((observer) => {
      const element: HTMLElement = document.getElementById(config.elementId);
      const csv = [];
      const rows: any = element.querySelectorAll("table tr");
      rows.forEach((rowElement, index: number) => {
        const row = [];
        const cols = rowElement.querySelectorAll("td, th");
        cols.forEach((col, colIndex: number) => {
          row.push(col.innerText);
        });
        csv.push(row.join(","));
      });
      const csvContent = 'data:text/csv;base64,' + btoa(csv.join("\n"));
      if (config.download) {
        this.download(config.fileName, csvContent);
        observer.next();
      }else {
        observer.next(csvContent);
      }
      observer.complete();
    });
  }

}
