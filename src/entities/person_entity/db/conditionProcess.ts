import { ILocal, SqlBuilder } from "@core";

export function conditionProcess(local:ILocal, query: SqlBuilder) {
  return query.limit(10000);
}