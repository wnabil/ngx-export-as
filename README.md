# ngx-export-as

[![npm version](https://badge.fury.io/js/ngx-export-as.svg)](https://badge.fury.io/js/ngx-export-as)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)

> **Angular service for exporting HTML/Table elements to multiple file formats**

A powerful and flexible Angular library that enables exporting HTML content, tables, and DOM elements to various file formats including PDF, Excel, Word, images, and more. Built with TypeScript and fully compatible with Angular 21+ and Ionic.

---

## 📋 Table of Contents

- [Features](#-features)
- [Supported Formats](#-supported-formats)
- [Installation](#-installation)
- [Quick Start](#-quick-start)
  - [Option 1: Standalone Component](#option-1-standalone-component-recommended)
  - [Option 2: App-Wide Provider](#option-2-app-wide-provider-appconfigts)
  - [Option 3: Legacy NgModule](#option-3-legacy-ngmodule-for-older-projects)
- [Usage Examples](#-usage-examples)
- [Configuration](#-configuration)
- [Format-Specific Options](#-format-specific-options)
- [Browser Support](#-browser-support)
- [Demo](#-demo)
- [Dependencies](#-dependencies)
- [Migration Guide (v1.20 → v1.21)](#-migration-guide-v120x--v1210)
- [Important Notes](#-important-notes)
- [Contributing](#-contributing)
- [License](#-license)

---

## ✨ Features

- 🎯 **Multiple Export Formats** - Support for 10+ file formats
- 📦 **Zero Configuration** - Works out of the box with sensible defaults
- 🎨 **Customizable** - Extensive options for each export format
- 🚀 **Lightweight** - Minimal dependencies and optimized bundle size
- 🔧 **TypeScript** - Full type safety and IntelliSense support
- ⚡ **Standalone-First** - Modern Angular architecture (v1.21.0+)
- 🌐 **SSR Compatible** - Server-side rendering support with platform checks
- 📱 **Ionic Ready** - Works seamlessly with Ionic applications
- 🎪 **Two Export Modes** - Download files or retrieve base64 content
- ♿ **IE Support** - Compatible with Internet Explorer (with polyfills)

---

## 📄 Supported Formats

| Format | Extension | Description | Table Required |
|--------|-----------|-------------|----------------|
| **PDF** | `.pdf` | Portable Document Format | ❌ No |
| **PNG** | `.png` | Image export | ❌ No |
| **Excel** | `.xlsx`, `.xls` | Microsoft Excel spreadsheet | ✅ Yes |
| **Word** | `.docx`, `.doc` | Microsoft Word document* | ❌ No |
| **CSV** | `.csv` | Comma-separated values | ✅ Yes |
| **Text** | `.txt` | Plain text file | ✅ Yes |
| **JSON** | `.json` | JavaScript Object Notation | ✅ Yes |
| **XML** | `.xml` | Extensible Markup Language | ✅ Yes |

> **Note:** Word document export (`.doc`, `.docx`) requires TypeScript target configuration `es2015` or higher. See [this issue](https://github.com/privateOmega/html-to-docx/issues/3#issuecomment-886222607) for details.

---

## 📦 Installation

### Using npm

```bash
npm install --save ngx-export-as
```

### Using yarn

```bash
yarn add ngx-export-as
```

### Using pnpm

```bash
pnpm add ngx-export-as
```

---

## 🚀 Quick Start

> **⚠️ Breaking Change in v1.21.0:** `ExportAsModule` has been removed. The library now uses standalone components. See migration examples below.

### Option 1: Standalone Component (Recommended)

Provide `ExportAsService` directly in your standalone component using modern `inject()`:

```typescript
import { Component, inject } from '@angular/core';
import { ExportAsService, ExportAsConfig } from 'ngx-export-as';

@Component({
  selector: 'app-export',
  templateUrl: './export.component.html',
  standalone: true,
  providers: [ExportAsService]  // Provide service in component
})
export class ExportComponent {
  private readonly exportAsService = inject(ExportAsService);
  
  // Your export methods here
}
```

### Option 2: App-Wide Provider (app.config.ts)

For using the service across multiple components, provide it globally in `app.config.ts`:

```typescript
import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { ExportAsService } from 'ngx-export-as';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    ExportAsService  // Available throughout the app
  ]
};
```

Then use it in any component:

```typescript
import { Component, inject } from '@angular/core';
import { ExportAsService, ExportAsConfig } from 'ngx-export-as';

@Component({
  selector: 'app-export',
  templateUrl: './export.component.html',
  standalone: true
  // No need to provide service here - already in app.config
})
export class ExportComponent {
  private readonly exportAsService = inject(ExportAsService);
}
```

### Option 3: Legacy NgModule (For Older Projects)

If you're still using NgModule-based architecture:

```typescript
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { ExportAsService } from 'ngx-export-as';
import { AppComponent } from './app.component';

@NgModule({
  declarations: [AppComponent],
  imports: [BrowserModule],
  providers: [ExportAsService],  // Add service to providers
  bootstrap: [AppComponent]
})
export class AppModule { }
```

Then inject in your component:

```typescript
import { Component, inject } from '@angular/core';
import { ExportAsService, ExportAsConfig } from 'ngx-export-as';

@Component({
  selector: 'app-export',
  templateUrl: './export.component.html'
})
export class ExportComponent {
  private readonly exportAsService = inject(ExportAsService);
}
```

### 2. Add HTML Element and Export Method

Create an HTML element with an ID to export:

```html
<div id="contentToExport">
  <h1>My Report</h1>
  <table>
    <tr>
      <th>Name</th>
      <th>Age</th>
      <th>City</th>
    </tr>
    <tr>
      <td>John Doe</td>
      <td>30</td>
      <td>New York</td>
    </tr>
  </table>
</div>

<button (click)="exportAsPDF()">Export as PDF</button>
```

Implement the export method:

```typescript
exportAsPDF() {
  const exportConfig: ExportAsConfig = {
    type: 'pdf',
    elementIdOrContent: 'contentToExport'
  };
  
  this.exportAsService.save(exportConfig, 'MyReport').subscribe(() => {
    console.log('PDF export started');
  });
}
```

---

## 💡 Usage Examples

### Download File (Automatic)

Export and automatically download the file:

```typescript
import { Component, inject } from '@angular/core';
import { ExportAsService, ExportAsConfig } from 'ngx-export-as';

@Component({
  selector: 'app-export',
  standalone: true,
  providers: [ExportAsService]
})
export class ExportComponent {
  private readonly exportAsService = inject(ExportAsService);
  
  exportToPDF() {
    const config: ExportAsConfig = {
      type: 'pdf',
      elementIdOrContent: 'myTableId'
    };
    
    this.exportAsService.save(config, 'my-report').subscribe(() => {
      // File download started
      console.log('Export completed!');
    });
  }
}
```

### Get Base64 Content

Retrieve the exported content as base64 for further processing:

```typescript
getBase64Content() {
  const config: ExportAsConfig = {
    type: 'png',
    elementIdOrContent: 'chartElement'
  };
  
  this.exportAsService.get(config).subscribe((content: string) => {
    // Use base64 content for upload, preview, etc.
    console.log('Base64 content:', content);
    
    // Example: Upload to server
    this.uploadToServer(content);
    
    // Example: Display in image tag
    this.imagePreview = content;
  });
}
```

### Export to Excel

Export table data to Excel spreadsheet:

```typescript
exportToExcel() {
  const config: ExportAsConfig = {
    type: 'xlsx',
    elementIdOrContent: 'dataTable',
    options: {
      bookType: 'xlsx',
      sheet: 'Sheet1'
    }
  };
  
  this.exportAsService.save(config, 'data-export').subscribe(() => {
    console.log('Excel file downloaded');
  });
}
```

### Export to JSON

Convert table data to JSON format:

```typescript
exportToJSON() {
  const config: ExportAsConfig = {
    type: 'json',
    elementIdOrContent: 'userTable'
  };
  
  // Note: JSON returns actual objects, not base64
  this.exportAsService.get(config).subscribe((data: any[]) => {
    console.log('JSON data:', data);
    // Process JSON data
    this.processData(data);
  });
}
```

### Multiple Export Buttons

```html
<div id="reportContent">
  <!-- Your content here -->
</div>

<div class="export-buttons">
  <button (click)="export('pdf')">Export PDF</button>
  <button (click)="export('xlsx')">Export Excel</button>
  <button (click)="export('csv')">Export CSV</button>
  <button (click)="export('png')">Export Image</button>
</div>
```

```typescript
export(format: 'pdf' | 'xlsx' | 'csv' | 'png') {
  const config: ExportAsConfig = {
    type: format,
    elementIdOrContent: 'reportContent'
  };
  
  this.exportAsService.save(config, `report-${Date.now()}`).subscribe(() => {
    console.log(`${format.toUpperCase()} export completed`);
  });
}
```

---

## ⚙️ Configuration

### ExportAsConfig Interface

```typescript
interface ExportAsConfig {
  type: SupportedExtensions;      // Required: Export format
  elementIdOrContent: string;     // Required: Element ID or content
  download?: boolean;             // Optional: Auto-download (used internally)
  fileName?: string;              // Optional: File name (used internally)
  options?: any;                  // Optional: Format-specific options
}
```

### Configuration Properties

| Property | Type | Required | Description |
|----------|------|----------|-------------|
| `type` | `SupportedExtensions` | ✅ Yes | The export file format (pdf, png, xlsx, etc.) |
| `elementIdOrContent` | `string` | ✅ Yes | The HTML element ID to export |
| `download` | `boolean` | ❌ No | Internal flag for download mode |
| `fileName` | `string` | ❌ No | Internal filename (set via `save()` method) |
| `options` | `any` | ❌ No | Format-specific configuration options |

---

## 🎛️ Format-Specific Options

### PDF Options

Powered by [html2pdf.js](https://github.com/eKoopmans/html2pdf.js):

```typescript
const config: ExportAsConfig = {
  type: 'pdf',
  elementIdOrContent: 'content',
  options: {
    margin: 10,
    filename: 'report.pdf',
    image: { type: 'jpeg', quality: 0.98 },
    html2canvas: { 
      scale: 2,
      useCORS: true,
      logging: false
    },
    jsPDF: { 
      unit: 'mm', 
      format: 'a4', 
      orientation: 'portrait' 
    },
    // Custom PDF manipulation
    pdfCallbackFn: (pdf) => {
      // Add page numbers
      const pageCount = pdf.internal.getNumberOfPages();
      for (let i = 1; i <= pageCount; i++) {
        pdf.setPage(i);
        pdf.setFontSize(10);
        pdf.text(`Page ${i} of ${pageCount}`, 
          pdf.internal.pageSize.getWidth() / 2, 
          pdf.internal.pageSize.getHeight() - 10,
          { align: 'center' }
        );
      }
    }
  }
};
```

**Common PDF Options:**
- `margin`: Margin size (number or object with top, right, bottom, left)
- `filename`: Output filename
- `image`: Image export options (type, quality)
- `html2canvas`: Canvas rendering options
- `jsPDF`: PDF generation options (unit, format, orientation)
- `pdfCallbackFn`: Custom callback function for PDF manipulation

### PNG Options

Powered by [html2canvas](https://github.com/niklasvh/html2canvas):

```typescript
const config: ExportAsConfig = {
  type: 'png',
  elementIdOrContent: 'chart',
  options: {
    scale: 2,                    // Higher quality (2x resolution)
    backgroundColor: '#ffffff',  // Background color
    logging: false,              // Disable console logs
    useCORS: true,              // Enable cross-origin images
    allowTaint: false,          // Prevent canvas tainting
    width: 1920,                // Custom width
    height: 1080                // Custom height
  }
};
```

### Excel Options

Powered by [SheetJS (xlsx)](https://github.com/SheetJS/sheetjs):

```typescript
const config: ExportAsConfig = {
  type: 'xlsx',
  elementIdOrContent: 'dataTable',
  options: {
    bookType: 'xlsx',
    sheet: 'Sales Data',
    raw: false,                  // Parse formatted values
    dateNF: 'yyyy-mm-dd',       // Date format
    cellDates: true             // Keep dates as date objects
  }
};
```

### Word Document Options

Powered by [html-docx-js](https://github.com/evidenceprime/html-docx-js):

> ⚠️ **Important:** Requires TypeScript `target: "es2015"` or higher in `tsconfig.json`

```typescript
const config: ExportAsConfig = {
  type: 'docx',
  elementIdOrContent: 'document',
  options: {
    orientation: 'landscape',    // or 'portrait'
    margins: {
      top: '20',
      right: '20',
      bottom: '20',
      left: '20'
    }
  }
};
```

### CSV/TXT Options

No additional options required. CSV format automatically quotes values and handles special characters.

### JSON Options

No additional options. Returns actual JSON objects (not base64):

```typescript
this.exportAsService.get(config).subscribe((data: any[]) => {
  // data is an array of objects
  console.log(data); // [{ name: 'John', age: '30' }, ...]
});
```

### XML Options

No additional options. Converts table to structured XML format.

---

## 🌐 Browser Support

### Modern Browsers
- ✅ Chrome (latest)
- ✅ Firefox (latest)
- ✅ Safari (latest)
- ✅ Edge (latest)
- ✅ Opera (latest)

### Internet Explorer Support

For IE11 support, you need to enable polyfills:

#### 1. Enable Angular Polyfills

Uncomment the required polyfills in `src/polyfills.ts`:

```typescript
// Enable all BROWSER POLYFILLS for IE support
import 'core-js/es/symbol';
import 'core-js/es/object';
import 'core-js/es/function';
import 'core-js/es/parse-int';
import 'core-js/es/parse-float';
import 'core-js/es/number';
import 'core-js/es/math';
import 'core-js/es/string';
import 'core-js/es/date';
import 'core-js/es/array';
import 'core-js/es/regexp';
import 'core-js/es/map';
import 'core-js/es/weak-map';
import 'core-js/es/set';
```

#### 2. Add TypedArray Polyfill

Create `src/polyfills/typedarray.js`:

```javascript
// TypedArray polyfill for IE
if (!Int8Array.__proto__) {
  console.log('Applying TypedArray polyfill...');
  // Polyfill implementation
  // See: https://github.com/inexorabletash/polyfill/blob/master/typedarray.js
}
```

Import in `polyfills.ts`:

```typescript
import './polyfills/typedarray.js';
```

---

## 🎪 Demo

### Running the Demo Application

Clone and run the demo application:

```bash
git clone https://github.com/wnabil/ngx-export-as.git
cd ngx-export-as
npm install
ng build ngx-export-as
ng serve
```

Then navigate to `http://localhost:4200` in your browser.

---

## 📚 Dependencies

This library uses the following open-source projects:

| Library | Version | Purpose | Documentation |
|---------|---------|---------|---------------|
| [html2canvas](https://github.com/niklasvh/html2canvas) | ^1.4.1 | PNG image export | [Docs](https://html2canvas.hertzen.com/) |
| [html2pdf.js](https://github.com/eKoopmans/html2pdf.js) | ^0.10.1 | PDF generation | [Docs](https://ekoopmans.github.io/html2pdf.js/) |
| [SheetJS (xlsx)](https://github.com/SheetJS/sheetjs) | ^0.18.5 | Excel export | [Docs](https://docs.sheetjs.com/) |
| [html-docx-js](https://github.com/evidenceprime/html-docx-js) | - | Word document export | [Docs](https://github.com/evidenceprime/html-docx-js) |

> 💡 **Tip:** Refer to the individual library documentation for advanced configuration options.

---

## 🔄 Migration Guide (v1.20.x → v1.21.0)

### Breaking Changes

Version 1.21.0 removes the `ExportAsModule` in favor of Angular's modern standalone architecture.

#### What Changed
- ❌ **Removed:** `ExportAsModule` (no longer exported from the library)
- ✅ **New:** Direct service provision in components or `app.config.ts`

#### Migration Steps

**Before (v1.20.x):**
```typescript
// app.module.ts
import { ExportAsModule } from 'ngx-export-as';

@NgModule({
  imports: [
    BrowserModule,
    ExportAsModule  // ❌ No longer available
  ]
})
export class AppModule { }
```

**After (v1.21.0) - Option 1: Standalone Component**
```typescript
import { Component } from '@angular/core';
import { ExportAsService } from 'ngx-export-as';

@Component({
  selector: 'app-export',
  standalone: true,
  providers: [ExportAsService]  // ✅ Provide directly
})
export class ExportComponent {
  private readonly exportAsService = inject(ExportAsService);
}
```

**After (v1.21.0) - Option 2: App Config**
```typescript
// app.config.ts
import { ExportAsService } from 'ngx-export-as';

export const appConfig: ApplicationConfig = {
  providers: [ExportAsService]  // ✅ App-wide provider
};
```

**After (v1.21.0) - Option 3: NgModule (Legacy)**
```typescript
// app.module.ts
import { ExportAsService } from 'ngx-export-as';

@NgModule({
  imports: [BrowserModule],
  providers: [ExportAsService]  // ✅ Add to providers instead
})
export class AppModule { }
```

---

## 📝 Important Notes

### Format-Specific Requirements

1. **Table Required Formats**
   - The following formats require a valid HTML `<table>` element:
     - Excel (`.xlsx`, `.xls`)
     - CSV (`.csv`)
     - Text (`.txt`)
     - JSON (`.json`)
     - XML (`.xml`)

2. **JSON Format Behavior**
   - Unlike other formats, JSON `get()` method returns actual JSON objects, not base64-encoded strings
   - First table row is used as object keys (headers)
   - Great for processing data in-memory before exporting

3. **Word Document Requirements**
   - DOCX/DOC export requires TypeScript compiler target `es2015` or higher
   - Update `tsconfig.json`:
     ```json
     {
       "compilerOptions": {
         "target": "es2015"
       }
     }
     ```

4. **PDF Element Types**
   - PDF export accepts multiple input types:
     - Element ID (string): `'myElementId'`
     - HTMLElement: `document.getElementById('myElement')`
     - Canvas: Direct canvas element
     - Image: Image element or data URL

5. **SSR (Server-Side Rendering)**
   - The library includes platform checks for SSR compatibility
   - Canvas-based exports (PDF, PNG) only work in browser context
   - Use base64 retrieval for Ionic or SSR applications

---

## 🤝 Contributing

Contributions are welcome! Here's how you can help:

### Reporting Issues

Found a bug or have a feature request?

1. Check [existing issues](https://github.com/wnabil/ngx-export-as/issues) first
2. Create a new issue with:
   - Clear description
   - Angular version
   - Browser information
   - Reproduction steps
   - Code examples

### Pull Requests

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/my-feature`
3. Make your changes
4. Test thoroughly
5. Commit with clear messages: `git commit -m "feat: add new feature"`
6. Push to your fork: `git push origin feature/my-feature`
7. Submit a pull request

### Development Setup

```bash
# Clone the repository
git clone https://github.com/wnabil/ngx-export-as.git
cd ngx-export-as

# Install dependencies
npm install

# Build the library
ng build ngx-export-as

# Run the demo app
ng serve

# Run tests
npm test

# Build for production
npm run package
```

### Contact

- **Email:** breakersniper@gmail.com
- **GitHub:** [@wnabil](https://github.com/wnabil)
- **Issues:** [GitHub Issues](https://github.com/wnabil/ngx-export-as/issues)

> 📧 If you don't receive a response within 2 days, please follow up on your issue.

---

## 📄 License

This project is licensed under the **MIT License**.

```
MIT License

Copyright (c) 2025 Wassem Nabil

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```

See [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

Special thanks to all contributors who have helped improve this library:

- [@jhoglin](https://github.com/jhoglin) - Angular 20 support
- [@ralphinevanbraak](https://github.com/ralphinevanbraak) - Angular 19 support
- [@AileThrowmountain](https://github.com/AileThrowmountain) - Angular 18 support
- [@MuhAssar](https://github.com/MuhAssar) - Angular 17 & 15 support
- [@enea4science](https://github.com/enea4science) - SSR fix
- [@kgish](https://github.com/kgish) - Angular 10 support
- [@souradeep07](https://github.com/souradeep07) - CSV fix
- [@Sreekanth2108](https://github.com/Sreekanth2108) - PDF callback feature

And to all users who reported issues and provided feedback!

---

## 🔗 Links

- **NPM Package:** [ngx-export-as](https://www.npmjs.com/package/ngx-export-as)
- **GitHub Repository:** [wnabil/ngx-export-as](https://github.com/wnabil/ngx-export-as)
- **Issue Tracker:** [GitHub Issues](https://github.com/wnabil/ngx-export-as/issues)
- **Changelog:** [CHANGELOG.md](CHANGELOG.md)
- **Migration Guide:** [MIGRATION.md](MIGRATION.md) - v1.20.x → v1.21.0
- **Author:** [Wassem Nabil](https://github.com/wnabil)
- **Website:** [qapas.com](https://qapas.com)

---

<div align="center">

**Made with ❤️ by [Wassem Nabil](https://github.com/wnabil)**

If this library helped you, please consider giving it a ⭐ on [GitHub](https://github.com/wnabil/ngx-export-as)!

</div>
