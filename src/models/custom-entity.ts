export interface CustomEntityOptions {
  fields?: string,
  parameters?: {[key: string]: string | number | boolean},
  page?: number,
  pagesize?: number,
  sort?: string,
  direction?: 'ASC' | 'DESC',
}
