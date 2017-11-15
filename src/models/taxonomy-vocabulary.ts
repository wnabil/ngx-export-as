export interface TaxonomyVocabulary {
  name: string,
  description?: string,
  hierarchy?: number,
  machine_name?: string,
  module?: string,
  uri?: string,
  vid?: number,
  weight?: number,
}

export interface TaxonomyVocabularyTree {
  depth: number,
  description: string,
  format: string,
  name: string,
  parents: number[],
  tid: number,
  vid: number,
  weight: number,
}
