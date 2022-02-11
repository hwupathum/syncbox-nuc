export class BcryptResponse {
  error: Error | undefined;
  hash: string | undefined;
  reply: boolean | undefined;

  constructor(
    error: Error | undefined,
    hash: string | undefined,
    reply: boolean | undefined
  ) {
    this.error = error;
    this.hash = hash;
    this.reply = reply;
  }
}
