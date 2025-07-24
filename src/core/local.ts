import { Field, FieldDefinition } from "@models";
import { State } from "@core";

interface ILocal {

    value: any,
    oldValue: any,
	newValue: any,
	state:State,
	field: Field,
	fieldDefinition?: FieldDefinition,
	fieldMap:Record<string, Field>,
	
	// processes
	setValue(fieldName: string, value: any):void;
	getValue(fieldName: string): any;
	getDisplayValue(fieldName: string): any;
	getFinalValue(fieldName: string): any;
	getField(fieldName:string): Field;
	refresh(fields:string|string[]):void;
}

export var local: ILocal = {

    value: null,
    oldValue: null,
	newValue: null,
	state:State.AUTO,
	//@ts-ignore
	field: null,
	//@ts-ignore
	fieldMap: null,
	setValue(fieldName:string, value:any) {
		const field = this.getField(fieldName);
		field.setValue(value, true);
	},
    getValue(fieldName:string): any {
		return this.getField(fieldName).getValue();
	},
	getDisplayValue(fieldName:string): any {
		return this.getField(fieldName).getDisplayValue();
	},
	getFinalValue(fieldName: string): any {
		return this.getField(fieldName).getFinalValue();
	},
	getField(fieldName: string): Field {
		const field = this.fieldMap[fieldName];
		
		if (field != null) {
			return field;
		}

		throw new Error(`Field not found: ${fieldName}`);
	},
	refresh(fields:string|string[]):void {
		if (Array.isArray(fields)) {
			fields.forEach(f => {
				const field = this.getField(f);
				field.recalculate();
				field.refreshVisuals();
			});
		} else {
			const field = this.getField(fields);
			field.recalculate();
			field.refreshVisuals();
		}
	}
};