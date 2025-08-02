import { ILocal, SqlBuilder } from '@core';

export function fromProcess(local:ILocal, sqlBuilder: SqlBuilder) {
	return sqlBuilder.from("BILL");
}