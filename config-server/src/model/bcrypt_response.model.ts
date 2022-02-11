export class BcryptResponse {
  error: Error | undefined;
  hash: string;

  constructor(error: Error | undefined, hash: string) {
    this.error = error;
    this.hash = hash;
  }
}
