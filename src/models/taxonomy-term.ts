export interface TaxonomyTerm {
  name: string,
  vid: number,
  vocabulary_machine_name?: string,
  description?: string,
  format?: string,
  parent?: number,
  tid?: number,
  uri?: string,
  weight?: number,
}
