import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { Observable } from 'rxjs';

import { ExportAsConfig } from './export-as-config.model';

import html2canvas from 'html2canvas';
import * as XLSX from 'xlsx';
// import HTMLtoDOCX from 'html-to-docx';
import html2pdf from 'html2pdf.js';
import { isPlatformBrowser } from '@angular/common';

/**
 * Angular service for exporting HTML/Table elements to various file formats
 * 
 * @description
 * This service provides functionality to export HTML content, tables, or specific DOM elements
 * into various file formats including PDF, PNG, Excel, Word documents, CSV, JSON, and XML.
 * 
 * Supports both browser download and base64 content retrieval for further processing.
 * 
 * **As of v1.21.0:** This is a standalone service - no NgModule required.
 * Provide it directly in your component or app.config.ts.
 * 
 * @export
 * @class ExportAsService
 * 
 * @example
 * ```typescript
 * // Standalone Component (Recommended)
 * import { Component, inject } from '@angular/core';
 * 
 * @Component({
 *   selector: 'app-export',
 *   standalone: true,
 *   providers: [ExportAsService]
 * })
 * export class ExportComponent {
 *   private readonly exportAsService = inject(ExportAsService);
 * 
 *   exportToPDF() {
 *     const config: ExportAsConfig = {
 *       type: 'pdf',
 *       elementIdOrContent: 'tableId'
 *     };
 *     this.exportAsService.save(config, 'my-export').subscribe(() => {
 *       console.log('Export completed');
 *     });
 *   }
 * }
 * ```
 * 
 * @example
 * ```typescript
 * // App-wide provider (app.config.ts)
 * export const appConfig: ApplicationConfig = {
 *   providers: [ExportAsService]
 * };
 * ```
 */
@Injectable()
export class ExportAsService {

  /**
   * Creates an instance of ExportAsService
   * @param {Object} platformId - Angular platform identifier for SSR compatibility
   * @memberof ExportAsService
   */
  constructor(
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    if (isPlatformBrowser(this.platformId)) {
      window['html2canvas'] = html2canvas;
    }
   }

  /**
   * Retrieves the exported content as a base64 string or JSON object
   * 
   * @description
   * This is the main method for retrieving exported content without downloading.
   * The return type varies by format:
   * - Most formats: base64 encoded string
   * - JSON format: returns actual JSON object (not base64)
   * 
   * @param {ExportAsConfig} config - Export configuration object
   * @returns {Observable<string | null>} Observable containing the base64 string or null
   * 
   * @example
   * ```typescript
   * const config: ExportAsConfig = {
   *   type: 'pdf',
   *   elementIdOrContent: 'myTableId'
   * };
   * 
   * this.exportAsService.get(config).subscribe(content => {
   *   console.log('Base64 content:', content);
   *   // Use content for upload, preview, etc.
   * });
   * ```
   * 
   * @memberof ExportAsService
   */
  get(config: ExportAsConfig): Observable<string | null> {
    // structure method name dynamically by type
    const func = 'get' + config.type.toUpperCase();
    // if type supported execute and return
    if (this[func]) {
      return this[func](config);
    }

    // throw error for unsupported formats
    return new Observable((observer) => { observer.error('Export type is not supported.'); });
  }

  /**
   * Exports and automatically downloads the file to the user's device
   * 
   * @description
   * This method triggers an automatic download of the exported content.
   * The file extension is automatically appended based on the export type.
   * 
   * @param {ExportAsConfig} config - Export configuration object
   * @param {string} fileName - The name of the file to be saved (without extension)
   * @returns {Observable<string | null>} Observable that completes when download starts
   * 
   * @example
   * ```typescript
   * private readonly exportAsService = inject(ExportAsService);
   * 
   * downloadReport() {
   *   const config: ExportAsConfig = {
   *     type: 'xlsx',
   *     elementIdOrContent: 'dataTable',
   *     options: { /* SheetJS options *\/ }
   *   };
   *   
   *   this.exportAsService.save(config, 'quarterly-report').subscribe(() => {
   *     console.log('Download started');
   *   });
   * }
   * ```
   * 
   * @memberof ExportAsService
   */
  save(config: ExportAsConfig, fileName: string): Observable<string | null> {
    // set download
    config.download = true;
    // get file name with type
    config.fileName = fileName + '.' + config.type;
    return this.get(config);
  }

  /**
   * Converts a base64 data URL string to a Blob object
   * 
   * @description
   * Extracts the MIME type and decodes the base64 string to create a Blob.
   * Useful for handling binary data in browsers.
   * 
   * @param {string} content - Base64 encoded data URL string (e.g., "data:image/png;base64,...")
   * @returns {Observable<Blob>} Observable containing the Blob object
   * 
   * @example
   * ```typescript
   * private readonly exportAsService = inject(ExportAsService);
   * 
   * convertToBlob() {
   *   const dataUrl = 'data:image/png;base64,iVBORw0KGgo...';
   *   this.exportAsService.contentToBlob(dataUrl).subscribe(blob => {
   *     console.log('Blob size:', blob.size);
   *   });
   * }
   * ```
   * 
   * @memberof ExportAsService
   */
  contentToBlob(content: string): Observable<Blob> {
    return new Observable((observer) => {
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
   * Removes the data URL prefix from a base64 string
   * 
   * @description
   * Strips the MIME type prefix (e.g., "data:text/csv;base64,") from a base64 data URL,
   * leaving only the raw base64 encoded content.
   * 
   * @param {string} fileContent - The complete base64 data URL string
   * @returns {string} The raw base64 string without the data URL prefix
   * 
   * @example
   * ```typescript
   * const dataUrl = 'data:text/csv;base64,SGVsbG8gV29ybGQ=';
   * const base64Only = this.removeFileTypeFromBase64(dataUrl);
   * // Result: 'SGVsbG8gV29ybGQ='
   * ```
   * 
   * @memberof ExportAsService
   */
  removeFileTypeFromBase64(fileContent: string): string {
    const re = /^data:[^]*;base64,/g;
    const newContent: string = re[Symbol.replace](fileContent, '');
    return newContent;
  }

  /**
   * Adds a data URL prefix to a raw base64 string
   * 
   * @description
   * Prepends the MIME type and base64 identifier to create a valid data URL
   * that can be used in browsers.
   * 
   * @param {string} fileContent - Raw base64 encoded string
   * @param {string} fileMime - MIME type (e.g., "text/csv", "image/png")
   * @returns {string} Complete base64 data URL string
   * 
   * @example
   * ```typescript
   * const base64 = 'SGVsbG8gV29ybGQ=';
   * const dataUrl = this.addFileTypeToBase64(base64, 'text/plain');
   * // Result: 'data:text/plain;base64,SGVsbG8gV29ybGQ='
   * ```
   * 
   * @memberof ExportAsService
   */
  addFileTypeToBase64(fileContent: string, fileMime: string): string {
    return `data:${fileMime};base64,${fileContent}`;
  }

  /**
   * Downloads a file from a data URL
   * 
   * @description
   * Converts a base64 data URL to a Blob and initiates a browser download.
   * 
   * @param {string} fileName - The name for the downloaded file (with extension)
   * @param {string} dataURL - Base64 data URL string
   * @returns {void}
   * 
   * @example
   * ```typescript
   * const dataUrl = 'data:text/csv;base64,SGVsbG8gV29ybGQ=';
   * this.downloadFromDataURL('myfile.csv', dataUrl);
   * ```
   * 
   * @memberof ExportAsService
   */
  downloadFromDataURL(fileName: string, dataURL: string): void {
    // create blob
    this.contentToBlob(dataURL).subscribe(blob => {
      // download the blob
      this.downloadFromBlob(blob, fileName);
    });
  }

  /**
   * Downloads a file from a Blob object
   * 
   * @description
   * Handles file download from Blob with cross-browser support including legacy IE.
   * Creates an object URL and triggers the download appropriately for each browser.
   * 
   * @param {Blob} blob - The Blob object containing file data
   * @param {string} fileName - The name for the downloaded file (with extension)
   * @returns {void}
   * 
   * @example
   * ```typescript
   * const blob = new Blob(['Hello World'], { type: 'text/plain' });
   * this.downloadFromBlob(blob, 'hello.txt');
   * ```
   * 
   * @memberof ExportAsService
   */
  downloadFromBlob(blob: Blob, fileName: string) {
    // get object url
    const url = window.URL.createObjectURL(blob);
    // check for microsoft internet explorer
    if (window.navigator && window.navigator['msSaveOrOpenBlob']) {
      // use IE download or open if the user using IE
      window.navigator['msSaveOrOpenBlob'](blob, fileName);
    } else {
      this.saveFile(fileName, url);
    }
  }

  /**
   * Creates and triggers a download link programmatically
   * 
   * @private
   * @description
   * Creates a temporary anchor element, simulates a click to trigger download,
   * and then removes the element from the DOM.
   * 
   * @param {string} fileName - The name for the downloaded file
   * @param {string} url - The object URL or data URL to download
   * @returns {void}
   * 
   * @memberof ExportAsService
   */
  private saveFile(fileName: string, url: string) {
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

  /**
   * Exports content to PDF format
   * 
   * @private
   * @description
   * Uses html2pdf.js library to convert HTML content to PDF.
   * Supports custom PDF manipulation via pdfCallbackFn option.
   * Accepts HTMLElement, Canvas, Image, or element ID as input.
   * 
   * @param {ExportAsConfig} config - Export configuration with PDF-specific options
   * @returns {Observable<string | null>} Observable with base64 PDF data or null if downloading
   * 
   * @example
   * ```typescript
   * // PDF with custom options
   * config.options = {
   *   margin: 10,
   *   filename: 'report.pdf',
   *   image: { type: 'jpeg', quality: 0.98 },
   *   html2canvas: { scale: 2 },
   *   jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
   *   pdfCallbackFn: (pdf) => {
   *     const pageCount = pdf.internal.getNumberOfPages();
   *     for (let i = 1; i <= pageCount; i++) {
   *       pdf.setPage(i);
   *       pdf.text('Page ' + i, 10, 10);
   *     }
   *   }
   * };
   * ```
   * 
   * @memberof ExportAsService
   */
  private getPDF(config: ExportAsConfig): Observable<string | null> {
    return new Observable((observer) => {
      if (!config.options) {
        config.options = {};
      }
      config.options.filename = config.fileName;
      const element: HTMLElement = document.getElementById(config.elementIdOrContent);
      const pdf = html2pdf().set(config.options).from(element ? element : config.elementIdOrContent);

      const download = config.download;
      const pdfCallbackFn = config.options.pdfCallbackFn;
      if (download) {
        if (pdfCallbackFn) {
          this.applyPdfCallbackFn(pdf, pdfCallbackFn).save();
        } else {
          pdf.save();
        }
        observer.next(null);
        observer.complete();
      } else {
        if (pdfCallbackFn) {
          this.applyPdfCallbackFn(pdf, pdfCallbackFn).outputPdf('datauristring').then(data => {
            observer.next(data);
            observer.complete();
          });
        } else {
          pdf.outputPdf('datauristring').then(data => {
            observer.next(data);
            observer.complete();
          });
        }
      }
    });
  }

  /**
   * Applies a custom callback function to modify the PDF before output
   * 
   * @private
   * @description
   * Allows custom modifications to the PDF object (headers, footers, page numbers, etc.)
   * before final rendering or download.
   * 
   * @param {any} pdf - The html2pdf instance
   * @param {Function} pdfCallbackFn - Callback function to modify the PDF
   * @returns {Promise} Promise that resolves after callback execution
   * 
   * @memberof ExportAsService
   */
  private applyPdfCallbackFn(pdf, pdfCallbackFn) {
    return pdf.toPdf().get('pdf').then((pdfRef) => {
      pdfCallbackFn(pdfRef);
    });
  }

  /**
   * Exports content to PNG image format
   * 
   * @private
   * @description
   * Uses html2canvas library to convert HTML element to PNG image.
   * Captures the visual representation of the specified DOM element.
   * 
   * @param {ExportAsConfig} config - Export configuration with html2canvas options
   * @returns {Observable<string | null>} Observable with base64 PNG data or null if downloading
   * 
   * @example
   * ```typescript
   * // PNG with custom options
   * config.options = {
   *   scale: 2,              // Higher quality
   *   backgroundColor: '#ffffff',
   *   logging: false,
   *   useCORS: true,        // For external images
   *   allowTaint: false
   * };
   * ```
   * 
   * @memberof ExportAsService
   */
  private getPNG(config: ExportAsConfig): Observable<string | null> {
    return new Observable((observer) => {
      const element: HTMLElement = document.getElementById(config.elementIdOrContent);
      html2canvas(element, config.options).then((canvas) => {
        const imgData = canvas.toDataURL('image/PNG');
        if (config.type === 'png' && config.download) {
          this.downloadFromDataURL(config.fileName, imgData);
          observer.next(null);
        } else {
          observer.next(imgData);
        }
        observer.complete();
      }, err => {
        observer.error(err);
      });
    });
  }

  /**
   * Exports HTML table to CSV format
   * 
   * @private
   * @description
   * Extracts data from HTML table elements (th, td) and converts to CSV format.
   * Each row becomes a CSV line with comma-separated values.
   * Values are quoted to handle special characters.
   * 
   * @param {ExportAsConfig} config - Export configuration (requires table element)
   * @returns {Observable<string | null>} Observable with base64 CSV data or null if downloading
   * 
   * @example
   * ```typescript
   * // HTML table structure required
   * <table id="myTable">
   *   <tr><th>Name</th><th>Age</th></tr>
   *   <tr><td>John</td><td>30</td></tr>
   * </table>
   * ```
   * 
   * @memberof ExportAsService
   */
  private getCSV(config: ExportAsConfig): Observable<string | null> {
    return new Observable((observer) => {
      const element: HTMLElement = document.getElementById(config.elementIdOrContent);
      const csv = [];
      const rows: any = element.querySelectorAll('table tr');
      for (let index = 0; index < rows.length; index++) {
        const rowElement = rows[index];
        const row = [];
        const cols = rowElement.querySelectorAll('td, th');
        for (let colIndex = 0; colIndex < cols.length; colIndex++) {
          const col = cols[colIndex];
          row.push('"'+col.innerText+'"');
        }
        csv.push(row.join(','));
      }
      const csvContent = 'data:text/csv;base64,' + this.btoa(csv.join('\n'));
      if (config.download) {
        this.downloadFromDataURL(config.fileName, csvContent);
        observer.next(null);
      } else {
        observer.next(csvContent);
      }
      observer.complete();
    });
  }

  /**
   * Exports HTML table to plain text format
   * 
   * @private
   * @description
   * Reuses CSV export logic but saves as .txt file extension.
   * Outputs comma-separated values in plain text format.
   * 
   * @param {ExportAsConfig} config - Export configuration (requires table element)
   * @returns {Observable<string | null>} Observable with base64 text data or null if downloading
   * 
   * @memberof ExportAsService
   */
  private getTXT(config: ExportAsConfig): Observable<string | null> {
    const nameFrags = config.fileName.split('.');
    config.fileName = `${nameFrags[0]}.txt`;
    return this.getCSV(config);
  }

  /**
   * Exports HTML table to Microsoft Excel format (.xls)
   * 
   * @private
   * @description
   * Uses SheetJS (xlsx library) to convert HTML table to Excel format.
   * Supports both legacy .xls and modern .xlsx formats.
   * The resulting file is compatible with Microsoft Excel and other spreadsheet applications.
   * 
   * @param {ExportAsConfig} config - Export configuration with SheetJS options
   * @returns {Observable<string | null>} Observable with base64 Excel data or null if downloading
   * 
   * @example
   * ```typescript
   * // Excel with custom options
   * config.options = {
   *   bookType: 'xlsx',
   *   sheet: 'Sheet1',
   *   raw: false,
   *   dateNF: 'yyyy-mm-dd'
   * };
   * ```
   * 
   * @memberof ExportAsService
   */
  private getXLS(config: ExportAsConfig): Observable<string | null> {
    return new Observable((observer) => {

      const element: HTMLElement = document.getElementById(config.elementIdOrContent);
      const ws3 = XLSX.utils.table_to_sheet(element, config.options);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws3, config.fileName);
      const out = XLSX.write(wb, { type: 'base64' });
      const xlsContent = 'data:application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;base64,' + out;
      if (config.download) {
        this.downloadFromDataURL(config.fileName, xlsContent);
        observer.next(null);
      } else {
        observer.next(xlsContent);
      }
      observer.complete();
    });
  }

  /**
   * Exports HTML table to Microsoft Excel format (.xlsx)
   * 
   * @private
   * @description
   * Alias for getXLS method. Both .xls and .xlsx use the same underlying implementation
   * via SheetJS library.
   * 
   * @param {ExportAsConfig} config - Export configuration with SheetJS options
   * @returns {Observable<string | null>} Observable with base64 Excel data or null if downloading
   * 
   * @memberof ExportAsService
   */
  private getXLSX(config: ExportAsConfig): Observable<string | null> {
    return this.getXLS(config);
  }

  // private getDOCX(config: ExportAsConfig): Observable<string | null> {
  //   return new Observable((observer) => {
  //     const contentDocument: string = document.getElementById(config.elementIdOrContent).outerHTML;
  //     const content = '<!DOCTYPE html>' + contentDocument;
  //     HTMLtoDOCX(content, null, config.options).then(converted => {
  //       if (config.download) {
  //         this.downloadFromBlob(converted, config.fileName);
  //         observer.next();
  //         observer.complete();
  //       } else {
  //         const reader = new FileReader();
  //         reader.onloadend = () => {
  //           const base64data = reader.result as string;
  //           observer.next(base64data);
  //           observer.complete();
  //         };
  //         reader.readAsDataURL(converted);
  //       }
  //     });
  //   });
  // }

  // private getDOC(config: ExportAsConfig): Observable<string | null> {
  //   return this.getDOCX(config);
  // }

  /**
   * Exports HTML table to JSON format
   * 
   * @private
   * @description
   * Converts HTML table to JSON array of objects.
   * First row is treated as headers (keys), subsequent rows as data values.
   * Headers are normalized (lowercase, spaces removed).
   * 
   * **Note:** Unlike other formats, this returns actual JSON objects, not base64.
   * 
   * @param {ExportAsConfig} config - Export configuration (requires table element)
   * @returns {Observable<any[] | null>} Observable with JSON array or null if downloading
   * 
   * @example
   * ```typescript
   * // HTML table:
   * // | Name  | Age |
   * // | John  | 30  |
   * // | Jane  | 25  |
   * 
   * // Result:
   * [
   *   { "name": "John", "age": "30" },
   *   { "name": "Jane", "age": "25" }
   * ]
   * ```
   * 
   * @memberof ExportAsService
   */
  private getJSON(config: ExportAsConfig): Observable<any[] | null> {
    return new Observable((observer) => {
      const data = []; // first row needs to be headers
      const headers = [];
      const table = <HTMLTableElement>document.getElementById(config.elementIdOrContent);
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
        observer.next(null);
      } else {
        observer.next(data);
      }
      observer.complete();
    });
  }

  /**
   * Exports HTML table to XML format
   * 
   * @private
   * @description
   * Converts HTML table to XML structure.
   * First cell of each row becomes the class name attribute,
   * remaining cells become data elements.
   * 
   * @param {ExportAsConfig} config - Export configuration (requires table element)
   * @returns {Observable<string | null>} Observable with base64 XML data or null if downloading
   * 
   * @example
   * ```typescript
   * // HTML table:
   * // | Name  | Age | City    |
   * // | John  | 30  | NYC     |
   * // | Jane  | 25  | Boston  |
   * 
   * // Result:
   * <?xml version="1.0" encoding="UTF-8"?>
   * <Root>
   *   <Classes>
   *     <Class name="John">
   *       <data>30</data>
   *       <data>NYC</data>
   *     </Class>
   *     <Class name="Jane">
   *       <data>25</data>
   *       <data>Boston</data>
   *     </Class>
   *   </Classes>
   * </Root>
   * ```
   * 
   * @memberof ExportAsService
   */
  private getXML(config: ExportAsConfig): Observable<string | null> {
    return new Observable((observer) => {
      let xml = '<?xml version="1.0" encoding="UTF-8"?><Root><Classes>';
      const tritem = document.getElementById(config.elementIdOrContent).getElementsByTagName('tr');
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
        observer.next(null);
      } else {
        observer.next(base64);
      }
      observer.complete();
    });
  }

  /**
   * Encodes a string to base64 with UTF-8 support
   * 
   * @private
   * @description
   * Wrapper around browser's btoa() with proper UTF-8 encoding.
   * Handles special characters and international text correctly.
   * Uses encodeURIComponent and unescape for proper character encoding.
   * 
   * @param {string} content - The string content to encode
   * @returns {string} Base64 encoded string
   * 
   * @memberof ExportAsService
   */
  private btoa(content: string) {
    return btoa(unescape(encodeURIComponent(content)));
  }

}
