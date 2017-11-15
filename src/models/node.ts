import { Entity, CreatedEntity } from './entity';

export interface NodeEntity extends Entity {
  title: string,
  readonly type: string,
  nid?: number,
  comment?: number,
  comment_count?: number
  last_comment_name?: string,
  last_comment_timestamp?: number,
  last_comment_uid?: number,
  log?: string,
  path?: string,
  promote?: number,
  revision_timestamp?: number,
  revision_uid?: number,
  sticky?: number,
  tnid?: number,
  translate?: number,
  vid?: number,
}

export interface CreatedNode extends CreatedEntity {
  nid: number,
}

export interface FileAttach {
  field_name: string,
}
