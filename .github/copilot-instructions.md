# ngx-export-as - AI Agent Instructions

## Project Overview

This is an **Angular library** (not an app) that exports HTML/table elements to multiple file formats (PDF, PNG, Excel, Word, CSV, JSON, XML). The project uses a **monorepo structure** with the library in `projects/ngx-export-as/` and a demo app in `src/` for testing.

## Architecture

### Library Structure (projects/ngx-export-as/)
- **Public API**: `src/public_api.ts` - Single entry point exporting: `ExportAsService`, `ExportAsConfig`, `ExportAsModule`
- **Service**: `export-as.service.ts` - Core service with private methods per format (`getPDF()`, `getPNG()`, `getXLS()`, etc.)
- **Configuration**: `export-as-config.model.ts` - Type-safe config interface with `SupportedExtensions` union type
- **Module**: `export-as.module.ts` - Provides `ExportAsService` globally

### Key Design Patterns

1. **Dynamic Method Resolution**: The `get()` method uses string manipulation to call format-specific methods:
   ```typescript
   const func = 'get' + config.type.toUpperCase(); // e.g., 'getPDF'
   if (this[func]) return this[func](config);
   ```

2. **Observable-Based API**: All methods return `Observable<string | null>` (except JSON which returns `Observable<any[] | null>`)
   - `save()`: Downloads file, returns `Observable` that completes when download starts
   - `get()`: Returns base64 content (except JSON returns actual objects)

3. **UTF-8 Base64 Encoding**: Custom `btoa()` wrapper handles special characters:
   ```typescript
   private btoa(content: string) {
     return btoa(unescape(encodeURIComponent(content)));
   }
   ```

4. **SSR Compatibility**: Platform checks prevent browser-only code from running server-side:
   ```typescript
   if (isPlatformBrowser(this.platformId)) {
     window['html2canvas'] = html2canvas;
   }
   ```

## Critical Build & Publishing Workflow

### Build Commands (package.json scripts)
```bash
npm run build_lib          # Build library only
npm run package            # Build + copy LICENSE/README to dist
npm run npm_pack           # Create .tgz package
npm run npm_publish        # Full publish workflow
```

### Important: TypeScript Target Requirements
- **Library tsconfig**: `target: "es2015"` (required for DOCX support via html-to-docx)
- **Demo app**: Can use any target
- See `projects/ngx-export-as/tsconfig.lib.json`

### Publishing Checklist
1. Build library: `ng build ngx-export-as --configuration=production`
2. Files automatically copied to `dist/ngx-export-as/`:
   - LICENSE (via `copy-license` script)
   - README.md (via `copy-readme` script)
3. Output location: `dist/ngx-export-as/` (configured in `ng-package.json`)

## Format-Specific Implementation Details

### Table-Required Formats
These **require** HTML `<table>` element (querySelector for `tr`, `td`, `th`):
- CSV, TXT, XLS/XLSX, JSON, XML

### PDF/PNG Accept Any Element
- Work with any `elementIdOrContent` (div, table, canvas, etc.)
- PDF also accepts: HTMLElement, Canvas, Image directly

### DOCX/DOC Status
- **Currently commented out** in service (see lines with `// private getDOCX()`)
- Requires `target: es2015` when enabled
- Issue reference: https://github.com/privateOmega/html-to-docx/issues/145

## Browser Polyfills (IE Support)

The demo app includes comprehensive IE11 polyfills:
1. **Core-JS polyfills**: All enabled in `src/polyfills.ts`
2. **TypedArray polyfill**: Custom implementation in `src/polyfills/typedarray.js`
3. **Buffer/Process shims**: Required for xlsx library compatibility

## Testing the Library Locally

### Demo App Development
```bash
ng build ngx-export-as    # Build library first
ng serve                   # Run demo at localhost:4200
```

**Important**: Always rebuild the library after changes to see them in demo app.

### Example Usage (see src/app/app.component.ts)
```typescript
config: ExportAsConfig = {
  type: 'pdf',
  elementIdOrContent: 'mytable',
  options: {
    jsPDF: { orientation: 'landscape' },
    pdfCallbackFn: this.pdfCallbackFn  // Add headers/footers
  }
};

this.exportAsService.save(config, 'myFile').subscribe(() => {
  // Download started
});
```

## JSDoc Standards

All public methods have comprehensive JSDoc with:
- `@description` with detailed explanation
- `@param` with types and descriptions
- `@returns` with Observable type details
- `@example` code blocks showing real usage
- `@memberof ExportAsService`

Private methods use same standard but include `@private` tag.

## Dependencies & External Libraries

| Format | Library | Version | Notes |
|--------|---------|---------|-------|
| PDF | html2pdf.js | ^0.10.1 | Wraps html2canvas + jsPDF |
| PNG | html2canvas | ^1.4.1 | Assigned to `window['html2canvas']` |
| Excel | xlsx (SheetJS) | ^0.18.5 | Table to workbook conversion |
| Word | html-to-docx | - | Currently disabled |

**CommonJS Dependencies**: Listed in `angular.json` under `allowedCommonJsDependencies` to suppress warnings.

## Code Conventions

1. **Service Methods Naming**: Private format methods follow `get{FORMAT}()` pattern (e.g., `getPDF()`, `getCSV()`)
2. **Config Validation**: No validation layer - relies on TypeScript types
3. **Error Handling**: Minimal - throws Observable errors for unsupported formats
4. **File Download**: Uses `msSaveOrOpenBlob` for IE, programmatic `<a>` click for modern browsers

## Common Pitfalls

1. **Forgetting to rebuild library**: Changes in `projects/ngx-export-as/` require `ng build ngx-export-as`
2. **Target configuration**: DOCX requires `es2015`, causes errors with lower targets
3. **JSON format difference**: Returns actual objects, not base64 strings
4. **Table element requirement**: CSV/Excel/JSON/XML fail without proper `<table>` structure
5. **SSR builds**: Some features (canvas-based) only work in browser context

## Version Support

Currently supports Angular 20+ (see package.json peerDependencies). Major version updates require:
1. Update `peerDependencies` in `projects/ngx-export-as/package.json`
2. Update root `package.json` devDependencies
3. Test all export formats in demo app
4. Update README changelog section
