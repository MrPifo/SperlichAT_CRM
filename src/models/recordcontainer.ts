import { SqlBuilder } from "@core";

export class Recordcontainer {

    table: string;
    primaryKeyColumn:string;
	sqlBuilder: SqlBuilder;

    fromProcess?: (sqlBuilder: SqlBuilder) => SqlBuilder;
    conditionProcess?: (sqlBuilder: SqlBuilder) => SqlBuilder;
    orderProcess?: (sqlBuilder: SqlBuilder) => SqlBuilder;

    constructor(tableName: string, primaryKeyColumn: string) {
        this.table = tableName;
        this.primaryKeyColumn = primaryKeyColumn,
        this.sqlBuilder = new SqlBuilder();
    }
}