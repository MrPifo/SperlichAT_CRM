import { SqlBuilder } from "@core";

export function conditionProcess(query: SqlBuilder) {
  return query.limit(10);
}