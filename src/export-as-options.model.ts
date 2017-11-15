export type SupportedExtensions = 'pdf' | 'png' | 'sql' | 'xlsx' | 'docx' | 'pptx' | 'txt' | 'csv' | 'json' | 'xml';

export interface ExportAsOptions {
  type: SupportedExtensions,
  tableID: string,
  tableName?: string,
  escape?: boolean,
  separator?: string[1],
  ignoreColumn?: number[],
  pdfFontSize?: number,
  pdfLeftMargin?: number,
  htmlContent?: boolean,
  consoleLog?: boolean,
}
