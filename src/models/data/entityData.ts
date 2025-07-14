import { entities, ViewMode } from "@/core";
import { Entity, Field, FieldDefinition } from "@models";
import { Value } from "@datamodels";

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

		Object.keys(raw).forEach(key => {
			const fieldDefinition:FieldDefinition = entity.getFieldNameByColumn(key);
			let field: Field = new Field(this.context, fieldDefinition.name);
			field.setData(raw[key]);

			if (key == entity.db.primaryKeyColumn) {
				this.uuid = field.value.getValueAsString();
			}

			this.fieldMap[key] = field;
		});
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
}