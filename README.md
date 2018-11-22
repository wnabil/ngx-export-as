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
  - PDF - [jsPDF](https://github.com/MrRio/jsPDF)
  - Microsoft Excel sheets - [html-docx-js](https://github.com/evidenceprime/html-docx-js)
  - Microsoft Word documents - [SheetJS js-xlsx](https://github.com/SheetJS/js-xlsx)

## Demo
 Running the demo:
```bash
git clone https://github.com/wnabil/ngx-export-as.git
cd ngx-export-as
npm install
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
    this.exportAsService.save(this.exportAsConfig, 'My File Name');
    // get the data as base64 or json object for json type - this will be helpful in ionic or SSR
    this.exportAsService.get(this.config).subscribe(content => {
      console.log(content);
    });
  }
```

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

### Known issues
  - Issue #1 PNG and PDF exports only the available elements in the view port // related to HTML2Canvas - PR welcome
  - Issue #3 This package using jsPDF but at the moment it doesn't support the multiple pages // PR welcome
  - Code comments are missing // WIP

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