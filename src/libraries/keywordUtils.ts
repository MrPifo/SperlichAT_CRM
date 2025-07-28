import { IListValue } from "@/components";
import { db } from "@/core";

export class KeywordUtils {
	static async getKeywords(category: string): Promise<IListValue[]> {
		let keys: string[] = await db.table(`SELECT KEYID, TITLE FROM KEYWORD WHERE CATEGORY = '${category}'`);
		let items: IListValue[] = keys.map(k => ({
			value: k[0],
			text:k[1]
		}));
		
		return items;
	}
	static async getKeywordContainers(): Promise<string[]> {
		let categories: string[] = await db.table(`SELECT DISTINCT CATEGORY FROM KEYWORD`);
		categories = categories.map(c => c[0]);
		
		return categories;
	}
	static async getKeywordTitle(category: string, value: string): Promise<string> {
		let keyTitle: any = await db.cell(`SELECT TITLE FROM KEYWORD WHERE KEYID = '${value}' AND CATEGORY = '${category}'`);

		return keyTitle;
	}
}