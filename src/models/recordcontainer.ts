import { SqlBuilder } from "@core";

export class Recordcontainer {

    primaryKeyColumn:string;
	sqlBuilder: SqlBuilder;

    fromProcess?: (sqlBuilder: SqlBuilder) => SqlBuilder;
    conditionProcess?: (sqlBuilder: SqlBuilder) => SqlBuilder;
	orderProcess?: (sqlBuilder: SqlBuilder) => SqlBuilder;

    constructor(primaryKeyColumn: string) {
        this.primaryKeyColumn = primaryKeyColumn,
        this.sqlBuilder = new SqlBuilder();
    }
}