# Angular 2+/Ionic 2+ Html to file export
#### Typescript angular module to export Table/HTML to popular file formats

[![npm version](https://badge.fury.io/js/ngx-export-as.svg)](https://badge.fury.io/js/ngx-export-as)  

A simple module to export the html or table elements to downloadable file.
## Supported Formats:
  - Image - .png
  - PDF - .pdf
  - CSV - .csv
  - Text - .txt
  - Microsoft Excel sheets - .xls, .xlsx
  - Microsoft Word documents - .doc, .docx
  - JSON - .json
  - XML - .xml

## Used libraries "Useful for custom format options"
  - PNG - [HTML2Canvas](https://github.com/niklasvh/html2canvas/)
  - PDF - [HTML2PDF](https://github.com/eKoopmans/html2pdf.js)
  - Microsoft Excel sheets - [SheetJS js-xlsx](https://github.com/SheetJS/js-xlsx)
  - Microsoft Word documents - [html-docx-js](https://github.com/evidenceprime/html-docx-js) 

## Demo
 Running the demo:
```bash
git clone https://github.com/wnabil/ngx-export-as.git
cd ngx-export-as
npm install
ng build ngx-export-as
ng serve
```
Then navigate to `localhost:4200` via your browser.

## Get Started
**(1)** Get Angular export as package:

```bash
npm install --save ngx-export-as
```

**(2)** import `ngx-export-as` in your `app.module.ts` and `imports` array.

```javascript
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';

import { ExportAsModule } from 'ngx-export-as';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    ExportAsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
```

**(3)** Import `'ExportAsService, ExportAsConfig'` into your component.

```javascript 
import { ExportAsService, ExportAsConfig } from 'ngx-export-as';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  exportAsConfig: ExportAsConfig = {
    type: 'png', // the type you want to download
    elementId: 'myTableElementId', // the id of html/table element
  }
  constructor(private exportAsService: ExportAsService) { }

}
```

**(4)** Use the available methods into your component to download or get the required data type.

```javascript 
  function export() {
    // download the file using old school javascript method
    this.exportAsService.save(this.exportAsConfig, 'My File Name').subscribe(() => {
      // save started
    });
    // get the data as base64 or json object for json type - this will be helpful in ionic or SSR
    this.exportAsService.get(this.config).subscribe(content => {
      console.log(content);
    });
  }
```

## IE Users
 - For Microsoft Internet Explorer this library requires many polyfills, please enable all BROWSER POLYFILLS.
 - [typedarray](https://github.com/inexorabletash/polyfill/blob/master/typedarray.js) Custom polyfill is also required.
 - Please refere to `polyfills.ts` demo

## Contribution, Ideas and pull requests are welcome, Please open an issue on Github or contact me on w.nabil@orangestudio.com if i didn't response in approx 2 days.

## Configuration

Basically all configurable options are wrapped into exportAsConfig object.
For the special options for each format alone please set your custom options inside exportAsConfig.options object.
Example:

```javascript
const exportAsConfig: ExportAsConfig = {
  type: 'docx', // the type you want to download
  elementId: 'myTableIdElementId', // the id of html/table element,
  options: { // html-docx-js document options
    orientation: 'landscape',
    margins: {
      top: '20'
    }
  }
}
```

## Important Notes
  - Json type get method will return the data in json object format not as base64
  - Not all the libraries supports the html element, for example the json and xlsx formats required the element to be an HTML Table

### Change Logs
- **1.0.0**
  - Initial release
  - Implement all available methods

- **1.1.0**
  - Upgrade to Angular 6

- **1.1.1**
  - fix issue #5

- **1.2.0**
  - switch to ng lib, ng-packagr

- **1.2.2**
  - fix readme and license

- **1.2.3**
  - Fix issue #9 - update readme
  - Fix issue #12 - Add support for internet explorer "Please check the docs section for IE"
  - Fix issue #15 - Support for angular 4 and 5
  - Fix issue #16 - add support for special language chars

- **1.2.4**
  - fix all pdf issues for html2canvas - #1, #3, #11

- **1.2.6**
  - Save method now will return a subscription, please make sure to trigger `.subscribe()`

- **1.3.0**
  - Upgrade to Angular 8

- **1.3.1**
  - Add support for PDF header, footer, page number and other possible actions before rendering - Thanks to Sreekanth2108 #35 fix #38

- **1.4.0**
  - Remove docx library as a temp solution for SSR builds, fix #21 - please use v1.3.1 until we have a new implementation for docx

- **1.4.1**
  - Update for Angular 9

- **1.4.2**
  - Fix #61 add support for any element type for pdf: available types now are string, element, canvas, img or element id

- **1.5.0**
  - Fix #84 Support for Angular 10, Thanks to kgish
