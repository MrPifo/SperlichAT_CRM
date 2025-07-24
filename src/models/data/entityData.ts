import { db, entities, ViewMode } from "@core";
import { Field, FieldDefinition } from "@models";

export class EntityData {

	uuid: string;
	context: string;
	fieldMap: Record<string, Field>;

	constructor(context: string) {
		this.uuid = "";
		this.context = context;
		this.fieldMap = {};
	}

	setDataFromMap(raw: Record<string, string[]>) {
		const entity = entities.getEntity(this.context);
		this.fieldMap = {};
		
		for (let key in raw) {
			const fieldDefinition:FieldDefinition = entity.getFieldNameByColumn(key);
			let field: Field = new Field(this.context, fieldDefinition.name, raw[key]);

			if (key == entity.db.primaryKeyColumn) {
				this.uuid = field.value.getValueAsString();
			}

			this.fieldMap[key] = field;
		}
	}
	setDataFrom2DArray(raw: string[]) {
		const entity = entities.getEntity(this.context); // Diese Zeile fehlt!
		if (raw != null) {
			for (let r = 0; r < raw.length; r++) {
				entity.getFields().forEach(f => {
					// fieldMap ist Record, nicht Map - verwende [] statt .set()
					this.fieldMap[f.name] = new Field(entity.name, f.name, ViewMode.DETAIL);
				});
			}
		}
	}
	extractColumn(fieldName: string): string|Object|Number|null {
		const field = this.fieldMap[fieldName];
		return field?.value.getValueAsString() ?? null;
	}
	extractDataByColumns(columns: string[]): string[] {
		const entity = entities.getEntity(this.context);
		const primaryKey = entity.getPrimaryKeyColumn();
		
		return columns.map(column => {
			const fieldKey = column === "#UUID" ? primaryKey : column;
			return this.fieldMap[fieldKey]?.getValue() ?? "";
		});
	}
	setField(fieldName: string, field: Field) {
		this.fieldMap[fieldName] = field;
	}
	hasField(fieldName: string): boolean {
		return this.fieldMap[fieldName] != null;
	}
	getColumns():string[] {
		const columns: string[] = [];

		for (let key in this.fieldMap) {
			const fieldDefinition = this.fieldMap[key].definition;

			if (fieldDefinition.isColumn() && columns.includes(fieldDefinition.column()) == false) {
				columns.push(fieldDefinition.column());
			}
		}

		return columns;
	}
	async upload() {
		const entity = entities.getEntity(this.context);
		await db.insertData(entity.db.table, this.getColumns(), this.getValues());
	}
}