import { FieldInfo, MysqlError } from "mysql";

export class MySQLResponse {
  error: MysqlError | null;
  results: any;
  fields: FieldInfo[] | undefined;

  constructor(error: MysqlError | null, results: any, fields: FieldInfo[] | undefined) {
    this.error = error;
    this.results = results;
    this.fields = fields;
  }
}
