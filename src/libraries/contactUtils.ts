import { db } from "@/core";

export class ContactUtils {
    static async getFullName(personId: string): Promise<string> {
		const data: string[] = await db.row(`SELECT FIRSTNAME, LASTNAME FROM PERSON WHERE PERSONID = '${personId}'`);
		return data.join(' ');
    }
}