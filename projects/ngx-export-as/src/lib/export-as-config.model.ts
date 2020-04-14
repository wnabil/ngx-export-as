export type SupportedExtensions = 'pdf' | 'png' | 'xlsx' | 'xls' | 'docx' | 'doc' | 'txt' | 'csv' | 'json' | 'xml';

export interface ExportAsConfig {
  type: SupportedExtensions;
  elementIdOrContent: string;
  download?: boolean;
  fileName?: string;
  options?: any;
}
