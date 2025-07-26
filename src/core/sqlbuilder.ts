import { api }  from '@libraries';

export class SqlBuilder {

    static readonly EQUAL: string = "=";
    static readonly NOT_EQUAL: string = "<>";
    static readonly GREATER: string = ">";
    static readonly GREATER_EQUALS: string = ">=";
    static readonly LESS: string = "<";
    static readonly LESS_EQUALS: string = "<=";
    static readonly NOT: string = "NOT";
    static readonly MINUS: string = "-";
    static readonly OR: string = "OR";
    static readonly AND: string = "AND";

    fromSrc?: string;
    selects: IExpression[] = [];
    conditions: IExpression[] = [];
    orderBys: OrderExpression[] = [];
    maxRows?: number;

    constructor() {
        
    }
    
    copy(): SqlBuilder {
        let builder = new SqlBuilder();
        builder.fromSrc = this.fromSrc;
        builder.selects = [...this.selects];
        builder.conditions = [...this.conditions];
        builder.orderBys = [...this.orderBys];
        builder.maxRows = this.maxRows;

        return builder;
    }

    from(table: string | SqlBuilder): SqlBuilder {
        if (table instanceof SqlBuilder) {
            this.fromSrc = table.toString();
        } else {
            this.fromSrc = table;
        }

        return this;
    }
    
    select(columns:DynamicValue | DynamicValue[]) : SqlBuilder {
        if (Array.isArray(columns)) {
            this.selects = this.selects.concat(columns.map(value => SqlBuilder.resolveDynamicColumn(value)));
        } else {
            this.selects.push(SqlBuilder.resolveDynamicValue(columns));
        }

        return this;
    }
    
    where(lhs: string, rhs: DynamicValue): SqlBuilder;
    where(lhs: string, rhs: DynamicValue, operator: string): SqlBuilder;
    where(expression: IExpression | string): SqlBuilder;
    where(lhs: string | IExpression, rhs?: DynamicValue, operator?: string): SqlBuilder {
        return this.whereAndCombined(lhs, rhs, operator);
    }
    
    and(lhs: string, rhs: DynamicValue): SqlBuilder;
    and(lhs: string, rhs: DynamicValue, operator: string): SqlBuilder;
    and(expression: IExpression | string): SqlBuilder;
    and(lhs: string | IExpression, rhs?: DynamicValue, operator?: string): SqlBuilder {
        return this.whereAndCombined(lhs, rhs, operator);
    }

    private whereAndCombined(lhs: string | IExpression, rhs?: DynamicValue, operator?: string): SqlBuilder {
        let expression: IExpression;
        rhs = SqlBuilder.resolveDynamicValue(rhs);

        if (typeof lhs === 'string') {
            expression = new SqlExpression(lhs);
        } else {
            expression = lhs;
        }
        
        if (rhs !== undefined) {
            expression = new BinaryExpression(expression, rhs, operator ?? SqlBuilder.EQUAL);
        }

        this.conditions.push(expression);

        return this;
    }
    
    or(lhs: string, rhs: DynamicValue): SqlBuilder;
    or(lhs: string, rhs: DynamicValue, operator: string): SqlBuilder;
    or(expression: IExpression | string): SqlBuilder;
    or(lhs: string | IExpression, rhs?: DynamicValue, operator?: string) : SqlBuilder {
        let expression: IExpression;
        rhs = SqlBuilder.resolveDynamicValue(rhs);

        if (typeof lhs === 'string') {
            expression = new SqlExpression(lhs);
        } else {
            expression = lhs;
        }
        
        if (rhs !== undefined) {
            expression = new BinaryExpression(expression, rhs, operator ?? SqlBuilder.EQUAL);
        }

        const lastExpression = this.conditions[this.conditions.length - 1];
        this.conditions[this.conditions.length - 1] = new BinaryExpression(lastExpression, expression, SqlBuilder.OR);

        return this;
    }
    
    orderBy(column: string, direction: 'asc' | 'desc' = 'asc') : SqlBuilder {
        let expression = new OrderExpression(column, direction);
        this.orderBys.push(expression);

        return this;
    }
    
    limit(maxRows: number) : SqlBuilder {
        this.maxRows = maxRows;

        return this;
    }
    
    static resolveDynamicValue(value: DynamicValue): IExpression;
    static resolveDynamicValue(value?: DynamicValue) : IExpression | undefined
    static resolveDynamicValue(value?: DynamicValue) : IExpression | undefined {
        if (typeof value === 'string') {
            return new StringExpression(value);
        } else if (typeof value === 'number') {
            return new NumberExpression(value);
        } else {
            return value;
        }
    }
    static resolveDynamicColumn(value: DynamicValue): IExpression;
    static resolveDynamicColumn(value?: DynamicValue) : IExpression | undefined
    static resolveDynamicColumn(value?: DynamicValue) : IExpression | undefined {
        if (typeof value === 'string') {
            return new SqlExpression(value);
        } else if (typeof value === 'number') {
            return new NumberExpression(value);
        } else {
            return value;
        }
    }

    // Neue insertData Methode für SqlBuilder
    static insertData(tableName: string, columns: string[], values: DynamicValue[]): string {
        if (columns.length !== values.length) {
            throw new Error("Columns and values arrays must have the same length");
        }
        
        const columnList = columns.join(", ");
        const valueList = values.map(v => {
            const expr = SqlBuilder.resolveDynamicValue(v);
            return expr ? expr.resolve() : 'NULL';
        }).join(", ");
        
        return `INSERT INTO ${tableName} (${columnList}) VALUES (${valueList})`;
    }
    static updateData(tableName: string, setColumns: string[], setValues: DynamicValue[], whereColumnsOrClause: string[] | string, whereValues?: DynamicValue[], whereOperators?: string[]): string {
        if (setColumns.length !== setValues.length) {
            throw new Error("SET columns and values arrays must have the same length");
        }

        const setClause = setColumns.map((col, index) => {
            const expr = SqlBuilder.resolveDynamicValue(setValues[index]);
            return `${col} = ${expr ? expr.resolve() : 'NULL'}`;
        }).join(', ');

        let whereClause: string;
        if (typeof whereColumnsOrClause === 'string') {
            whereClause = whereColumnsOrClause;
        } else {
            const whereColumns = whereColumnsOrClause;
            if (!whereValues || whereColumns.length !== whereValues.length) {
                throw new Error("WHERE columns and values arrays must have the same length");
            }
            whereClause = whereColumns.map((col, index) => {
                const expr = SqlBuilder.resolveDynamicValue(whereValues[index]);
                const operator = whereOperators?.[index] || '=';
                return `${col} ${operator} ${expr ? expr.resolve() : 'NULL'}`;
            }).join(' AND ');
        }

        return `UPDATE ${tableName} SET ${setClause} WHERE ${whereClause}`;
    }
    static updateDataWithBuilder(tableName: string, setData: Record<string, DynamicValue>, builder: SqlBuilder): string {
        const setColumns = Object.keys(setData);
        const setValues = Object.values(setData);
        const setClause = setColumns.map((col, index) => {
            const expr = SqlBuilder.resolveDynamicValue(setValues[index]);
            return `${col} = ${expr ? expr.resolve() : 'NULL'}`;
        }).join(', ');

        const whereClause = builder.conditions.length > 0 
            ? `WHERE ${builder.conditions.map(c => c.resolve()).join(` ${SqlBuilder.AND} `)}`
            : '';

        return `UPDATE ${tableName} SET ${setClause} ${whereClause}`.trim();
    }
    static deleteData(tableName: string, whereColumnsOrClause: string[] | string, whereValues?: DynamicValue[], whereOperators?: string[]): string {
        let whereClause: string;
        if (typeof whereColumnsOrClause === 'string') {
            whereClause = whereColumnsOrClause;
        } else {
            const whereColumns = whereColumnsOrClause;
            if (!whereValues || whereColumns.length !== whereValues.length) {
                throw new Error("WHERE columns and values arrays must have the same length");
            }
            whereClause = whereColumns.map((col, index) => {
                const expr = SqlBuilder.resolveDynamicValue(whereValues[index]);
                const operator = whereOperators?.[index] || '=';
                return `${col} ${operator} ${expr ? expr.resolve() : 'NULL'}`;
            }).join(' AND ');
        }

        return `DELETE FROM ${tableName} WHERE ${whereClause}`;
    }
    static deleteDataWithBuilder(tableName: string, builder: SqlBuilder): string {
        const whereClause = builder.conditions.length > 0 
            ? `WHERE ${builder.conditions.map(c => c.resolve()).join(` ${SqlBuilder.AND} `)}`
            : '';

        if (!whereClause) {
            throw new Error("DELETE requires WHERE clause for safety");
        }

        return `DELETE FROM ${tableName} ${whereClause}`.trim();
    }

    async table(asMap?:boolean): Promise<any> {
        let result = await api.requestFromDB({
            sql: this.toString(),
            singleRow: false,
            asMap:asMap ?? false
        });

        return result["data"]["rows"];
    }

    toString():string {
        let sql: string = "";
        
        sql += `SELECT ${this.selects.map(s => s.resolve()).join(",")} `;
        sql += `FROM ${this.fromSrc} `;

        if (this.conditions.length > 0) {
            sql += `WHERE ${this.conditions.map(c => c.resolve()).join(` ${SqlBuilder.AND} `)} `;
        }
        if (this.orderBys.length > 0) {
            sql += `ORDER BY ${this.orderBys.map(o => o.resolve()).join(', ')} `;
        }
        if (this.maxRows != null) {
            sql += `LIMIT ${this.maxRows} `;
        }

        return sql;
    }
}
class UnaryExpression implements IExpression {
    
    expression: IExpression;
    operator: string;

    constructor(expression: IExpression, operator: string) {
        this.expression = expression;
        this.operator = operator;
    }

    resolve(): string {
        return `(${this.operator} ${this.expression.resolve()})`;
    }
}
class BinaryExpression implements IExpression {

    lhs: IExpression;
    rhs: IExpression;
    operator: string;

    constructor(lhs:IExpression, rhs:IExpression, operator:string) {
        this.lhs = lhs;
        this.rhs = rhs;
        this.operator = operator;
    }

    resolve(): string {
        return `(${this.lhs.resolve()} ${this.operator} ${this.rhs.resolve()})`;
    }
}
class StringExpression implements IExpression {

    value: string;

    constructor(value:string) {
        this.value = value;
    }

    resolve(): string {
        return `'${StringExpression.escape(this.value)}'`;
    }

    static escape(value:string):string {
        return value.replace("'", "''");
    }
}
class NumberExpression implements IExpression {

    value: number;

    constructor(value:number) {
        this.value = value;
    }

    resolve(): string {
        return `${this.value}`;
    }
}
class OrderExpression implements IExpression {

    column: string;
    direction: 'asc' | 'desc';

    constructor(column: string, direction:'asc' | 'desc') {
        this.column = column;
        this.direction = direction;
    }

    resolve(): string {
        return `${this.column} ${this.direction}`;
    }

}
class SqlExpression implements IExpression {
    
    value: string;

    constructor(value: string) {
        this.value = value;
    }

    resolve(): string {
        return `${this.value}`;
    }
}
interface IExpression {

    resolve() : string;

}
export type DynamicValue = IExpression | string | number;
export interface IQueryOptions {
    selects?: DynamicValue[];
}