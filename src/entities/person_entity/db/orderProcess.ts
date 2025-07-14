import { SqlBuilder } from '@core';

export function orderProcess(query: SqlBuilder) {
  return query.orderBy("PERSON.FIRSTNAME").orderBy("PERSON.LASTNAME").orderBy("PERSON.DATEOFBIRTH");
}