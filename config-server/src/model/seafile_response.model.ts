import { ExecException } from "child_process";

export class SeafileResponse {
  error: ExecException | null;
  stdout: string;
  stderr: string;

  constructor(error: ExecException | null, stdout: string, stderr: string) {
    this.error = error;
    this.stdout = stdout;
    this.stderr = stderr;
  }
}
