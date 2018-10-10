import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Rx';

import { ExportAsConfig } from './export-as-config.model';

import * as html2canvas from 'html2canvas';
import * as jsPDF from 'jspdf';
import * as XLSX from 'xlsx';
import * as htmlDocx from 'html-docx-js/dist/html-docx';

global['html2canvas'] = html2canvas;

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
      observer.next(new Blob([u8arr], { type: mime }));
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

  downloadFromDataURL(fileName: string, dataURL: string): void {
    this.contentToBlob(dataURL).subscribe(blob => {
      this.downloadFromBlob(blob, fileName);
    });
  }

  downloadFromBlob(blob: Blob, fileName: string) {
    const element = document.createElement('a');
    const url = window.URL.createObjectURL(blob);
    element.setAttribute('download', fileName);
    element.style.display = 'none';
    document.body.appendChild(element);
    element.href = url;
    element.click();
    document.body.removeChild(element);
  }

  private getPDF(config: ExportAsConfig): Observable<string | null> {
    return Observable.create((observer) => {
      const jspdf = new jsPDF();
      const element: HTMLElement = document.getElementById(config.elementId);
      jspdf.addHTML(element, function () {
        if (config.download) {
          jspdf.save(config.fileName);
          observer.next();
        } else {
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
          this.downloadFromDataURL(config.fileName, imgData);
          observer.next();
        } else {
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
        this.downloadFromDataURL(config.fileName, csvContent);
        observer.next();
      } else {
        observer.next(csvContent);
      }
      observer.complete();
    });
  }

  private getTXT(config: ExportAsConfig): Observable<string | null> {
    const nameFrags = config.fileName.split(".");
    config.fileName = `${nameFrags[0]}.txt`;
    return this.getCSV(config);
  }

  private getXLS(config: ExportAsConfig): Observable<string | null> {
    return Observable.create((observer) => {

      const element: HTMLElement = document.getElementById(config.elementId);
      const ws3 = XLSX.utils.table_to_sheet(element, config.options);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws3, config.fileName);
      const out = XLSX.write(wb, { type: 'base64' });
      const xlsContent = 'data:application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;base64,' + out;
      if (config.download) {
        this.downloadFromDataURL(config.fileName, xlsContent);
        observer.next();
      } else {
        observer.next(xlsContent);
      }
      observer.complete();
    });
  }

  private getXLSX(config: ExportAsConfig): Observable<string | null> {
    return this.getXLS(config);
  }

  private getDOCX(config: ExportAsConfig): Observable<string | null> {
    return Observable.create((observer) => {
      const contentDocument: string = document.getElementById(config.elementId).outerHTML;
      const content = '<!DOCTYPE html>' + contentDocument;
      const converted = htmlDocx.asBlob(content, config.options);
      if (config.download) {
        this.downloadFromBlob(converted, config.fileName);
        observer.next();
        observer.complete();
      } else {
        const reader = new FileReader();
        reader.onloadend = () => {
          const base64data = reader.result;
          observer.next(base64data);
          observer.complete();
        }
        reader.readAsDataURL(converted);
      }
    });
  }

  private getDOC(config: ExportAsConfig): Observable<string | null> {
    return this.getDOCX(config);
  }

  private getJSON(config: ExportAsConfig): Observable<any[] | null> {
    return Observable.create((observer) => {
      const data = []; // first row needs to be headers
      const headers = [];
      const table = <HTMLTableElement>document.getElementById(config.elementId);
      for (let index = 0; index < table.rows[0].cells.length; index++) {
        headers[index] = table.rows[0].cells[index].innerHTML.toLowerCase().replace(/ /gi, '');
      }
      // go through cells
      for (let i = 1; i < table.rows.length; i++) {
        const tableRow = table.rows[i]; const rowData = {};
        for (var j = 0; j < tableRow.cells.length; j++) {
          rowData[headers[j]] = tableRow.cells[j].innerHTML;
        }
        data.push(rowData);
      }
      const jsonString = JSON.stringify(data);
      const jsonBase64 = Buffer.from(jsonString).toString("base64");
      const dataStr = "data:text/json;base64," + jsonBase64;
      if (config.download) {
        this.downloadFromDataURL(config.fileName, dataStr);
        observer.next();
      } else {
        observer.next(data);
      }
      observer.complete();
    });
  }

  private getXML(config: ExportAsConfig): Observable<string | null> {
    return Observable.create((observer) => {
      var xml = '<?xml version="1.0" encoding="UTF-8"?><Root><Classes>';
      const tritem = document.getElementById(config.elementId).getElementsByTagName("tr");
      for (let i = 0; i < tritem.length; i++) {
        const celldata = tritem[i];
        if (celldata.cells.length > 0) {
          xml += "<Class name='" + celldata.cells[0].textContent + "'>\n";
          for (var m = 1; m < celldata.cells.length; ++m) {
            xml += "\t<data>" + celldata.cells[m].textContent + "</data>\n";
          }
          xml += "</Class>\n";
        }
      }
      xml += '</Classes></Root>';
      const base64 = 'data:text/xml;base64,' + btoa(xml);
      if (config.download) {
        this.downloadFromDataURL(config.fileName, base64);
        observer.next();
      } else {
        observer.next(base64);
      }
      observer.complete();
    });
  }

}
