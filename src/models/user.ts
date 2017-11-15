import { Entity, CreatedEntity } from './entity';

export interface User extends Entity {
  mail: string,
  access?: number,
  data?: boolean,
  init?: string,
  login?: number,
  roles?: {[rid: number]: string},
  signature?: string,
  signature_format?: string,
  theme?: number,
  timezone?: string,
  timestamp?: number,
  pass?: string,
}

export interface LoginCredentials {
  username: string,
  password: string,
}

export interface CreatedUser extends CreatedEntity {
  uid: number,
}

export interface PasswordReset {
  uid: number,
  timestamp:  number,
  hashed_pass: string,
}

export interface PasswordResetResponse {
  message: string,
  pass_reset_token: string,
}
