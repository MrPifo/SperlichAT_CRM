import {v4 as uuidv4} from 'uuid';
import { db } from '@core';

class Utils {

	getUUID():string {
		return uuidv4();
	}
	async getNextSequenceNumber(tableName:string, field:string): Promise<number> {
		const num = await db.cell(`SELECT COALESCE(MAX(${field}), 0) + 1 AS UID FROM ${tableName}`);
		console.log(num);
		return Number(num);
	}
}
export var utils = new Utils();