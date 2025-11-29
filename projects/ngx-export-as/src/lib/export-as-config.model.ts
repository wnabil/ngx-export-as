/**
 * Supported file export formats
 * @type SupportedExtensions
 * 
 * Available export formats:
 * - 'pdf': Portable Document Format
 * - 'png': Portable Network Graphics image
 * - 'xlsx': Microsoft Excel spreadsheet (OpenXML format)
 * - 'xls': Microsoft Excel spreadsheet (legacy format)
 * - 'docx': Microsoft Word document (OpenXML format) - Requires target config es2015
 * - 'doc': Microsoft Word document (legacy format) - Requires target config es2015
 * - 'txt': Plain text file
 * - 'csv': Comma-Separated Values
 * - 'json': JavaScript Object Notation
 * - 'xml': Extensible Markup Language
 */
export type SupportedExtensions = 'pdf' | 'png' | 'xlsx' | 'xls' | 'docx' | 'doc' | 'txt' | 'csv' | 'json' | 'xml';

/**
 * Configuration interface for exporting HTML/Table elements to various file formats
 * 
 * @interface ExportAsConfig
 * 
 * @example
 * ```typescript
 * const config: ExportAsConfig = {
 *   type: 'pdf',
 *   elementIdOrContent: 'myTableId',
 *   options: {
 *     filename: 'export.pdf',
 *     image: { type: 'jpeg', quality: 0.98 },
 *     html2canvas: { scale: 2 },
 *     jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' }
 *   }
 * };
 * ```
 */
export interface ExportAsConfig {
  /**
   * The target export file format
   * @type {SupportedExtensions}
   */
  type: SupportedExtensions;

  /**
   * The HTML element ID or content to export
   * - For element ID: pass the ID as a string (e.g., 'myTableId')
   * - For PDF: can also accept HTMLElement, Canvas, Image, or raw content string
   * @type {string}
   */
  elementIdOrContent: string;

  /**
   * Whether to automatically download the file after generation
   * - true: File will be downloaded automatically
   * - false/undefined: File content will be returned as base64 or JSON
   * @type {boolean}
   * @optional
   */
  download?: boolean;

  /**
   * The filename for the exported file (without extension)
   * Extension will be added automatically based on the export type
   * @type {string}
   * @optional
   */
  fileName?: string;

  /**
   * Format-specific options for customizing the export behavior
   * 
   * Options vary by export type:
   * - **PDF**: html2pdf.js options (margins, orientation, filename, jsPDF, html2canvas, pdfCallbackFn)
   * - **PNG**: html2canvas options (scale, backgroundColor, logging, etc.)
   * - **XLSX/XLS**: SheetJS options (bookType, sheet name, etc.)
   * - **DOCX/DOC**: html-docx-js options (orientation, margins, etc.)
   * 
   * @type {any}
   * @optional
   * 
   * @example
   * ```typescript
   * // PDF options
   * options: {
   *   margin: 10,
   *   filename: 'myfile.pdf',
   *   image: { type: 'jpeg', quality: 0.98 },
   *   html2canvas: { scale: 2 },
   *   jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
   *   pdfCallbackFn: (pdf) => {
   *     // Custom PDF modifications
   *     pdf.addPage();
   *     pdf.text('Header', 10, 10);
   *   }
   * }
   * 
   * // PNG options
   * options: {
   *   scale: 2,
   *   backgroundColor: '#ffffff',
   *   logging: false
   * }
   * 
   * // DOCX options
   * options: {
   *   orientation: 'landscape',
   *   margins: { top: '20', bottom: '20' }
   * }
   * ```
   */
  options?: any;
}
