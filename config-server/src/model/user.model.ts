export class User {
  user_id: number;
  username: string;
  password: string;
  scope: string;
  path_hash: string;

  constructor(
    user_id: number,
    username: string,
    password: string,
    scope: string,
    path_hash: string
  ) {
    this.user_id = user_id;
    this.username = username;
    this.password = password;
    this.scope = scope;
    this.path_hash = path_hash;
  }
}
