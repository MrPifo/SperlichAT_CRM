import { SqlBuilder } from '@core';

export function orderProcess(query: SqlBuilder) {
  return query.orderBy("BILL.DATE");
}