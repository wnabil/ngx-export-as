import { Entity, CreatedEntity } from './entity';

export interface CommentEntity extends Entity {
  nid: number,
  subject?: string,
  hostname?: string,
  homepage?: string,
  mail?: string,
  new?: number,
  node_type?: string,
  pid?: number,
  registered_name?: string,
  signature?: string,
  signature_format?: string,
  thread?: string,
  u_uid?: number,
}

export interface CreatedComment extends CreatedEntity {
  cid: number,
}
