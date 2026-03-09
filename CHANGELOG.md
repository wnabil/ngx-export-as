# Changelog

All notable changes to ngx-export-as will be documented in this file.

## Version 1.21.x


### v1.21.2

#### 🐛 **Fixes**
- **Fixed invalid tslib dependency version** - Corrected `tslib` from non-existent `^2.8.2` to valid `^2.8.1` to resolve `npm ERR! notarget` installation failures in consuming apps. [Issue #137](https://github.com/wnabil/ngx-export-as/issues/137)



### v1.21.1

#### 🔒 **Security**
- **Fixed SheetJS Security Vulnerabilities** - Upgraded from outdated npm registry version (0.18.5) to latest official release (0.20.3) from SheetJS CDN
- Package now uses `https://cdn.sheetjs.com/xlsx-0.20.3/xlsx-0.20.3.tgz` as the authoritative source
- Eliminates all xlsx-related npm audit security warnings

#### 📦 **Dependencies**
- **SheetJS (xlsx): 0.18.5 → 0.20.3** - Migrated to official SheetJS CDN distribution
- Updated README.md and documentation with correct SheetJS version and source

### v1.21.0

#### 🚨 **BREAKING CHANGES**
- **Removed NgModule** - `ExportAsModule` has been completely removed from the library
- **Standalone-First Architecture** - Library now follows Angular's modern standalone component pattern
- **Migration Required**: 
  - Remove `ExportAsModule` from your imports
  - Provide `ExportAsService` directly in components or `app.config.ts`
  - See README for migration examples

#### ⬆️ **Upgrades**
- **Angular 21 Support** - Upgraded to Angular 21.0.1
- 📦 **Dependencies Updated**:
  - TypeScript: 5.8.3 → 5.9.3
  - ng-packagr: 20.0.0 → 21.0.0
  - zone.js: 0.15.0 → 0.16.0
  - html2pdf.js: 0.10.1 → 0.12.1
  - core-js: 3.30.2 → 3.47.0
  - rxjs: 7.8.1 → 7.8.2
  - tslib: 2.5.2 → 2.8.1
  - And other dependency updates

#### 🔧 **Configuration**
- Added explicit TypeScript target ES2022 settings
- Demo app migrated to standalone components with `app.config.ts`

## Version 1.20.x (2024-2025)

### v1.20.1
- 🔧 Maintenance updates for Angular 20

### v1.20.0
- ⬆️ **Angular 20 Support** - PR [#118](https://github.com/wnabil/ngx-export-as/pull/118) by [@jhoglin](https://github.com/jhoglin)

## Version 1.19.x

### v1.19.0
- ⬆️ **Angular 19 Support** - PR [#116](https://github.com/wnabil/ngx-export-as/pull/116) by [@ralphinevanbraak](https://github.com/ralphinevanbraak)

## Version 1.18.x

### v1.18.0
- ⬆️ **Angular 18 Support** - PR [#115](https://github.com/wnabil/ngx-export-as/pull/115) by [@AileThrowmountain](https://github.com/AileThrowmountain)

## Version 1.17.x

### v1.17.0
- ⬆️ **Angular 17 Support** - PR [#114](https://github.com/wnabil/ngx-export-as/pull/114) by [@MuhAssar](https://github.com/MuhAssar)

## Version 1.16.x

### v1.16.0
- ⬆️ **Angular 16 Support**

## Version 1.15.x

### v1.15.1
- 🐛 **Fix:** html2canvas SSR compatibility - PR [#112](https://github.com/wnabil/ngx-export-as/pull/112) by [@enea4science](https://github.com/enea4science)

### v1.15.0
- ⬆️ **Angular 15 Support** - Issue [#110](https://github.com/wnabil/ngx-export-as/issues/110) by [@MuhAssar](https://github.com/MuhAssar)

## Version 1.14.x

### v1.14.1
- ⬆️ **Angular 14 Support** - Issue [#109](https://github.com/wnabil/ngx-export-as/issues/109)
- ⚠️ **Note:** DOCX temporarily not supported - [Related Issue](https://github.com/privateOmega/html-to-docx/issues/145)

## Version 1.13.x

### v1.13.0
- ⬆️ **Angular 13 Support** - Issue [#102](https://github.com/wnabil/ngx-export-as/issues/102)

## Version 1.12.x

### v1.12.2
- 🐛 **Fix:** CSV comma handling - Issue [#97](https://github.com/wnabil/ngx-export-as/issues/97) by [@souradeep07](https://github.com/souradeep07)

### v1.12.1
- ✨ **Feature:** Re-enabled DOCX support - Issue [#76](https://github.com/wnabil/ngx-export-as/issues/76)
- ⚠️ **Requires:** TypeScript target `es2015` or higher

### v1.12.0
- ⬆️ **Angular 12 Support**

## Version 1.5.x

### v1.5.0
- ⬆️ **Angular 10 Support** - Issue [#84](https://github.com/wnabil/ngx-export-as/issues/84) by [@kgish](https://github.com/kgish)

## Version 1.4.x

### v1.4.2
- ✨ **Feature:** PDF now supports multiple element types - Issue [#61](https://github.com/wnabil/ngx-export-as/issues/61)
  - Accepts: string, HTMLElement, Canvas, Image, or element ID

### v1.4.1
- ⬆️ **Angular 9 Support**

### v1.4.0
- 🐛 **Fix:** SSR builds - Issue [#21](https://github.com/wnabil/ngx-export-as/issues/21)
- ⚠️ **Temporary:** DOCX support removed (restored in v1.12.1)

## Version 1.3.x

### v1.3.1
- ✨ **Feature:** PDF callback function support - Issue [#38](https://github.com/wnabil/ngx-export-as/issues/38), PR [#35](https://github.com/wnabil/ngx-export-as/pull/35) by [@Sreekanth2108](https://github.com/Sreekanth2108)
  - Add custom headers, footers, page numbers before rendering

### v1.3.0
- ⬆️ **Angular 8 Support**

## Version 1.2.x

### v1.2.6
- 🔄 **Breaking:** `save()` method now returns Observable
  - **Migration:** Add `.subscribe()` to all `save()` calls

### v1.2.4
- 🐛 **Fix:** All PDF html2canvas issues - Issues [#1](https://github.com/wnabil/ngx-export-as/issues/1), [#3](https://github.com/wnabil/ngx-export-as/issues/3), [#11](https://github.com/wnabil/ngx-export-as/issues/11)

### v1.2.3
- 🐛 **Fix:** Internet Explorer support - Issue [#12](https://github.com/wnabil/ngx-export-as/issues/12)
- 🐛 **Fix:** Special language characters - Issue [#16](https://github.com/wnabil/ngx-export-as/issues/16)
- ⬆️ **Support:** Angular 4 and 5 - Issue [#15](https://github.com/wnabil/ngx-export-as/issues/15)
- 📝 **Docs:** Updated README - Issue [#9](https://github.com/wnabil/ngx-export-as/issues/9)

### v1.2.2
- 📝 **Docs:** Fixed README and license

### v1.2.0
- 🔄 **Migration:** Switched to Angular library format with ng-packagr

## Version 1.1.x

### v1.1.1
- 🐛 **Fix:** Issue [#5](https://github.com/wnabil/ngx-export-as/issues/5)

### v1.1.0
- ⬆️ **Angular 6 Support**

## Version 1.0.x

### v1.0.0
- 🎉 **Initial Release**
- ✨ All export methods implemented
- 📄 Support for PDF, PNG, XLS, XLSX, CSV, TXT, JSON, XML
