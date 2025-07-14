import { IFieldParams } from "@datamodels";

export class FieldDefinition {

	primaryKey: boolean = false;
	name: string;
	params: IFieldParams;

	column = (): string => this.params.column ?? '';
	isColumn = ():boolean => this.params.column != null;

	constructor(name: string, params: IFieldParams) {
		this.name = name;
		this.params = params;

		// Set column name to field name if true
		if (params.column != null && params.column === 'true') {
			params.column = name;
		}
		if (params.primaryKey != null && params.primaryKey === true) {
			this.primaryKey = true;
		}
	}

	getTitle():string {
		return this.params.title ?? this.name;
	}
}