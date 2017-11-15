import { Entity, CreatedEntity } from './entity';

export interface FileEntity extends Entity {
  file: string,
  filename: string,
  filemime?: string,
  filesize?: number,
  image_styles?: string[],
  target_uri?: string,
  uri?: string,
  uri_full?: string,
  fid?: number,
}

export interface CreatedFile extends CreatedEntity {
  fid: number,
}
