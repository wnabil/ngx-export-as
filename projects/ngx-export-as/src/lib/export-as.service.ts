import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { ExportAsConfig } from './export-as-config.model';

import html2canvas from 'html2canvas';
import * as XLSX from 'xlsx';
import * as htmlDocx from 'html-docx-js/dist/html-docx';
import html2pdf from 'html2pdf.js';

window['html2canvas'] = html2canvas;

@Injectable()
export class ExportAsService {

  constructor() { }

  /**
   * Main base64 get method, it will return the file as base64 string
   * @param config your config
   */
  get(config: ExportAsConfig): Observable<string | null> {
    // structure method name dynamically by type
    const func = 'get' + config.type.toUpperCase();
    // if type supported execute and return
    if (this[func]) {
      return this[func](config);
    }

    // throw error for unsupported formats
    return Observable.create((observer) => { observer.error('Export type is not supported.'); });
  }

  /**
   * Save exported file in old javascript way
   * @param config your custom config
   * @param fileName Name of the file to be saved as
   */
  save(config: ExportAsConfig, fileName: string): Observable<string | null> {
    // set download
    config.download = true;
    // get file name with type
    config.fileName = fileName + '.' + config.type;
    return this.get(config);
  }

  /**
   * Converts content string to blob object
   * @param content string to be converted
   */
  contentToBlob(content: string): Observable<Blob> {
    return Observable.create((observer) => {
      // get content string and extract mime type
      const arr = content.split(','), mime = arr[0].match(/:(.*?);/)[1],
        bstr = atob(arr[1]);
      let n = bstr.length;
      const u8arr = new Uint8Array(n);
      while (n--) {
        u8arr[n] = bstr.charCodeAt(n);
      }
      observer.next(new Blob([u8arr], { type: mime }));
      observer.complete();
    });
  }

  /**
   * Removes base64 file type from a string like "data:text/csv;base64,"
   * @param fileContent the base64 string to remove the type from
   */
  removeFileTypeFromBase64(fileContent: string): string {
    const re = /^data:[^]*;base64,/g;
    const newContent: string = re[Symbol.replace](fileContent, '');
    return newContent;
  }

  /**
   * Structure the base64 file content with the file type string
   * @param fileContent file content
   * @param fileMime file mime type "text/csv"
   */
  addFileTypeToBase64(fileContent: string, fileMime: string): string {
    return `data:${fileMime};base64,${fileContent}`;
  }

  /**
   * create downloadable file from dataURL
   * @param fileName downloadable file name
   * @param dataURL file content as dataURL
   */
  downloadFromDataURL(fileName: string, dataURL: string): void {
    // create blob
    this.contentToBlob(dataURL).subscribe(blob => {
      // download the blob
      this.downloadFromBlob(blob, fileName);
    });
  }

  /**
   * Downloads the blob object as a file
   * @param blob file object as blob
   * @param fileName downloadable file name
   */
  downloadFromBlob(blob: Blob, fileName: string) {
    // get object url
    const url = window.URL.createObjectURL(blob);
    // check for microsoft internet explorer
    if (window.navigator && window.navigator.msSaveOrOpenBlob) {
      // use IE download or open if the user using IE
      window.navigator.msSaveOrOpenBlob(blob, fileName);
    } else {
      // if not using IE then create link element
      const element = document.createElement('a');
      // set download attr with file name
      element.setAttribute('download', fileName);
      // set the element as hidden
      element.style.display = 'none';
      // append the body
      document.body.appendChild(element);
      // set href attr
      element.href = url;
      // click on it to start downloading
      element.click();
      // remove the link from the dom
      document.body.removeChild(element);
    }
  }

  private getPDF(config: ExportAsConfig): Observable<string | null> {
    return Observable.create((observer) => {
      if (!config.options) {
        config.options = {};
      }
      config.options.filename = config.fileName;
      const element: HTMLElement = document.getElementById(config.elementId);
      const pdf = html2pdf().set(config.options).from(element, 'element');
      if (config.download) {
        pdf.save();
        observer.next();
        observer.complete();
      } else {
        pdf.outputPdf('datauristring').then(data => {
          observer.next(data);
          observer.complete();
        });
      }
    });
  }

  private getPNG(config: ExportAsConfig): Observable<string | null> {
    return Observable.create((observer) => {
      const element: HTMLElement = document.getElementById(config.elementId);
      html2canvas(element, config.options).then((canvas) => {
        const imgData = canvas.toDataURL('image/PNG');
        if (config.type === 'png' && config.download) {
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
      const rows: any = element.querySelectorAll('table tr');
      for (let index = 0; index < rows.length; index++) {
        const rowElement = rows[index];
        const row = [];
        const cols = rowElement.querySelectorAll('td, th');
        for (let colIndex = 0; colIndex < cols.length; colIndex++) {
          const col = cols[colIndex];
          row.push(col.innerText);
        }
        csv.push(row.join(','));
      }
      const csvContent = 'data:text/csv;base64,' + this.btoa(csv.join('\n'));
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
    const nameFrags = config.fileName.split('.');
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
        };
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
        for (let j = 0; j < tableRow.cells.length; j++) {
          rowData[headers[j]] = tableRow.cells[j].innerHTML;
        }
        data.push(rowData);
      }
      const jsonString = JSON.stringify(data);
      const jsonBase64 = this.btoa(jsonString);
      const dataStr = 'data:text/json;base64,' + jsonBase64;
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
      let xml = '<?xml version="1.0" encoding="UTF-8"?><Root><Classes>';
      const tritem = document.getElementById(config.elementId).getElementsByTagName('tr');
      for (let i = 0; i < tritem.length; i++) {
        const celldata = tritem[i];
        if (celldata.cells.length > 0) {
          xml += '<Class name="' + celldata.cells[0].textContent + '">\n';
          for (let m = 1; m < celldata.cells.length; ++m) {
            xml += '\t<data>' + celldata.cells[m].textContent + '</data>\n';
          }
          xml += '</Class>\n';
        }
      }
      xml += '</Classes></Root>';
      const base64 = 'data:text/xml;base64,' + this.btoa(xml);
      if (config.download) {
        this.downloadFromDataURL(config.fileName, base64);
        observer.next();
      } else {
        observer.next(base64);
      }
      observer.complete();
    });
  }

  private btoa(content: string) {
    return btoa(unescape(encodeURIComponent(content)));
  }

}
