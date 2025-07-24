import { EntityData } from "./entityData";

export class EntityDataRows {

	context: string;
	rows: EntityData[];

	constructor(context: string) {
		this.context = context;
		this.rows = [];
	}

	setDataFromMap(raw: any) {
		this.rows = [];
		
		for (let i = 0; i < raw.length; i++) {
			const row = raw[i];
			const data = new EntityData(this.context);
			data.setDataFromMap(row);
			this.rows[i] = data;
		}
	}
	setDataFrom2DArrayString(raw:string[][]) {
		console.log(raw);
	}
	getDataByColumns(columns: string[]): string[][] {
		let data: string[][] = [];
		
		for (let i = 0; i < this.rows.length; i++) {
			const row = this.rows[i];
			data.push(row.extractDataByColumns(columns));
		}

		return data;
	}
}