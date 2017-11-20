export type SupportedExtensions = 'pdf' | 'png' | 'sql' | 'xlsx' | 'docx' | 'pptx' | 'txt' | 'csv' | 'json' | 'xml';

export interface ExportAsConfig {
  type: SupportedExtensions,
  elementId: string,
  download?: boolean,
  fileName?: string,
  options?: any,
}
