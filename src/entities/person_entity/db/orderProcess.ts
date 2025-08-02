import { ILocal, SqlBuilder } from '@core';

export function orderProcess(local:ILocal, query: SqlBuilder) {
  return query.orderBy("PERSON.FIRSTNAME").orderBy("PERSON.LASTNAME").orderBy("PERSON.DATEOFBIRTH");
}