import { ILocal, SqlBuilder } from "@core";

export class Recordcontainer {

    table: string;
    primaryKeyColumn:string;
	sqlBuilder: SqlBuilder;

    fromProcess?: (local:ILocal, sqlBuilder: SqlBuilder) => SqlBuilder;
    conditionProcess?: (local:ILocal, sqlBuilder: SqlBuilder) => SqlBuilder;
    orderProcess?: (local:ILocal, sqlBuilder: SqlBuilder) => SqlBuilder;

    constructor(tableName: string, primaryKeyColumn: string) {
        this.table = tableName;
        this.primaryKeyColumn = primaryKeyColumn,
        this.sqlBuilder = new SqlBuilder();
    }
}