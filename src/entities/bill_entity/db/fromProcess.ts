import { SqlBuilder } from '@core';

export function fromProcess(sqlBuilder: SqlBuilder) {
	return sqlBuilder.from("BILL");
}