export interface ViewOptions {
  filters?: {[key: string]: any},
  display_id?: string,
  args?: Array<string | number | boolean>,
  offset?: number,
  limit?: number,
  format_output?: 0 | 1,
  page?: number,
}
