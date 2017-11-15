export interface Entity {
  changed?: number,
  cid?: number,
  created?: number,
  language?: string,
  picture?: number,
  name?: string,
  uid?: number,
  status?: number,
}

export interface CreatedEntity {
  uri: string,
}
