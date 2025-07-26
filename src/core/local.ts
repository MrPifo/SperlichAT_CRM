import { Field, FieldDefinition, Parameter } from "@models";
import { State } from "@core";

interface ILocal {

    value: any,
    oldValue: any,
	newValue: any,
	state:State,
	field: Field|null,
	params:Record<string, Parameter>,
	fieldDefinition: FieldDefinition|null,
	fieldMap:Record<string, Field>,
	
	// processes
	setValue(fieldName: string, value: any): void;
	setParameter(paramName: string, value: any): void;
	getValue(fieldName: string): any;
	getDisplayValue(fieldName: string): any;
	getFinalValue(fieldName: string): any;
	getField(fieldName: string): Field;
	hasParameter(paramName: string): boolean;
	getParameter(paramName:string): Parameter;
	getParameterValue(parameterName: string):any;
	refresh(fields: string | string[]): void;
	clear(): void;
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
	params:{},
	setValue(fieldName:string, value:any) {
		const field = this.getField(fieldName);
		field.setValue(value, true);
	},
    getValue(fieldName:string): any {
		return this.getField(fieldName).getValue();
	},
	hasParameter(name:string): boolean {
		const param = this.params[name];
		
		return param != null;
	},
	setParameter(paramName: string, value: any) {
		let param = this.params[paramName];

		if (param == null) {
			param = new Parameter(paramName, value);
			this.params[paramName] = param;
		} else {
			param.setValue(value);
		}
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
	getParameter(paramName: string):Parameter {
		const param = this.params[paramName];
		
		if (param != null) {
			return param;
		}

		throw new Error(`Parameter not found: ${paramName}`);
	},
	getParameterValue(parameterName: string):any {
		const param = this.params[parameterName];
		
		return param.getValue();
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
	},
	clear():void {
		this.value = null;
		this.oldValue = null;
		this.newValue = null;
		this.state = State.AUTO;
		this.field = null;
		this.fieldDefinition = null;
		this.fieldMap = {};
		this.params = {};
	}
};