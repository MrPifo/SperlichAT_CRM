import { api } from "@/libraries";
import { DynamicValue, SqlBuilder } from "@core";

export class DB {

    async insertData(tableName: string, columns: string[], values: DynamicValue[]): Promise<any> {
        const sql = SqlBuilder.insertData(tableName, columns, values);
        
        const result = await api.executeDB(sql, {
            // Hier könntest du zusätzliche Optionen hinzufügen
        });
        
        return result;
    }

    // Convenience-Methode für ein einzelnes Objekt
    async insertObject(tableName: string, data: Record<string, DynamicValue>): Promise<any> {
        const columns = Object.keys(data);
        const values = Object.values(data);
        
        return this.insertData(tableName, columns, values);
    }

    // Convenience-Methode für mehrere Zeilen
    async insertMany(tableName: string, columns: string[], valueRows: DynamicValue[][]): Promise<any[]> {
        const results = [];
        
        for (const values of valueRows) {
            const result = await this.insertData(tableName, columns, values);
            results.push(result);
        }
        
        return results;
    }

    async updateData(tableName: string, setColumns: string[], setValues: DynamicValue[], whereClause: string): Promise<any>;
    async updateData(tableName: string, setColumns: string[], setValues: DynamicValue[], whereColumns: string[], whereValues: DynamicValue[], whereOperators?: string[]): Promise<any>;
    async updateData(tableName: string, setColumns: string[], setValues: DynamicValue[], whereColumnsOrClause: string[] | string, whereValues?: DynamicValue[], whereOperators?: string[]): Promise<any> {
        if (setColumns.length !== setValues.length) {
            throw new Error("SET columns and values arrays must have the same length");
        }
        
        const sql = SqlBuilder.updateData(
            tableName, 
            setColumns, 
            setValues, 
            whereColumnsOrClause, 
            whereValues, 
            whereOperators
        );
        //console.log(sql);
        
        const result = await api.executeDB(sql);
        return result;
    }
    async updateObject(tableName: string, setData: Record<string, DynamicValue>, whereData: Record<string, DynamicValue>): Promise<any> {
        const setColumns = Object.keys(setData);
        const setValues = Object.values(setData);
        const whereColumns = Object.keys(whereData);
        const whereValues = Object.values(whereData);
        return this.updateData(tableName, setColumns, setValues, whereColumns, whereValues);
    }
    async updateById(tableName: string, setColumns: string[], setValues: DynamicValue[], primaryKeyId: DynamicValue, idColumn: string): Promise<any> {
        return this.updateData(tableName, setColumns, setValues, [idColumn], [primaryKeyId]);
    }
    async updateWithBuilder(tableName: string, setData: Record<string, DynamicValue>, whereBuilder: (builder: SqlBuilder) => SqlBuilder): Promise<any> {
        const builder = new SqlBuilder();
        const configuredBuilder = whereBuilder(builder);
        
        const sql = SqlBuilder.updateDataWithBuilder(tableName, setData, configuredBuilder);
        const result = await api.executeDB(sql);
        return result;
    }

    async deleteData(tableName: string, whereClause: string): Promise<any>;
    async deleteData(tableName: string, whereColumns: string[], whereValues: DynamicValue[], whereOperators?: string[]): Promise<any>;
    async deleteData(tableName: string, whereColumnsOrClause: string[] | string, whereValues?: DynamicValue[], whereOperators?: string[]): Promise<any> {
        const sql = SqlBuilder.deleteData(
            tableName, 
            whereColumnsOrClause, 
            whereValues, 
            whereOperators
        );
        
        const result = await api.executeDB(sql);
        return result;
    }
    async deleteObject(tableName: string, whereData: Record<string, DynamicValue>): Promise<any> {
        const whereColumns = Object.keys(whereData);
        const whereValues = Object.values(whereData);
        return this.deleteData(tableName, whereColumns, whereValues);
    }
    async deleteById(tableName: string, primaryKeyId: DynamicValue, idColumn: string = 'id'): Promise<any> {
        return this.deleteData(tableName, [idColumn], [primaryKeyId]);
    }
    async deleteWithBuilder(tableName: string, whereBuilder: (builder: SqlBuilder) => SqlBuilder): Promise<any> {
        const builder = new SqlBuilder();
        const configuredBuilder = whereBuilder(builder);
        
        const sql = SqlBuilder.deleteDataWithBuilder(tableName, configuredBuilder);
        const result = await api.executeDB(sql);
        return result;
    }
    async cell(sql:string): Promise<string|null> {
        const result = await api.executeDB(sql, {
            asMap:false
        });
        const rows = result["data"]["rows"];

        if (rows.length > 0) {
            return rows[0][0];
        }

        return null;
    }
    async row(sql:string, asMap?:boolean): Promise<string[]> {
        const result = await api.executeDB(sql, {
            asMap:asMap ?? false
        });
        const rows = result["data"]["rows"];

        if (rows.length > 0) {
            return rows[0];
        }

        return [];
    }
    async table(sql:string, asMap?:boolean): Promise<string[]> {
        const result = await api.executeDB(sql, {
            asMap:asMap ?? false
        });
        const rows = result["data"]["rows"];

        if (rows.length > 0) {
            return rows;
        }

        return [];
    }
}

export const db = new DB();