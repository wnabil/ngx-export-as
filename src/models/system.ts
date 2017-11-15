import { User } from './user';

export interface SystemConnection {
  sessid: string,
  session_name: string,
  token?: string,
  user: User,
}
